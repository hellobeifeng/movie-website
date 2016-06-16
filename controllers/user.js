var doubanMovie = require('../services/doubanMovie');
var when = require('when');
var User = require('../models/user');
var _ = require('underscore');
var hash = require('../utils/pass').hash;
/**
 * 身份验证函数：首先验证用户是否存在，然后验证用户密码是否正确
 * 表单密码+用户salt生成hash，然后对照用户模型中的user.hash
 */
function authenticate(name, pass, fn) {
    User.findOne({username: name}, function (err, user) {
        if (user) {
            //if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}
module.exports = {

    //判断用户是否存在
    userExist:function(req, res, next) {
        User.findOne({username: req.body.user.username}, function (err, user) {
            if (user) {
                res.redirect("/user/register");
            } else {
                console.log('success');
                next();
            }
        });
    },

    login: function (req, res) {
        res.render('user/login', {
            title: '登录'
        })
    },
    /**
     * 登录验证函数
     * 首先 调用authenticate()函数，根据用户名和密码验证hash值
     * 跟注册相比，省略了先调用Hasn()生成hash再保存User模型的过程
     * 因为此处是登录环节，已经默认有name了，直接用name查user
     * @param req
     * @param res
     */
    postLogin: function (req, res) {
        var username = req.body.user.username;
        var password = req.body.user.password;
        var userObj = req.body.user;

        authenticate(username, password, function (err, user) {
                if (user) {
                    req.session.user = user;
                    res.redirect('/movie');
                }else{
                    res.redirect('/user/login');
                }
        });
    },
    register: function (req, res) {
        res.render('user/register', {
            title: '注册'
        })
    },
    /**
     * 注册提交模块
     * 数据库不保存明文密码
     * 首先 hash(password)生成salt,hash
     * 其次 根据name,salt,hash保存用户模型
     * 最后 调用authenticate()函数验证哈希值是否正确
     * @param req
     * @param res
     */
    postRegister: function (req, res) {
        var userObj = req.body.user;
        hash(userObj.password, function (err, salt, hash) {
            if (err) console.log('here' + err);
            var user = new User({
                username: userObj.username,
                salt: salt,//将utils/pass.js中处理生成的salt 和 hash作为属性，和用户名一起构成新的user对象
                hash: hash
            }).save(function (err, newUser) {
                    if (err) throw err;
                    authenticate(newUser.username, userObj.password, function (err, user) {
                        if (user) {
                            res.redirect('/movie');
                        }else{
                            res.redirect('/user/login');
                        }
                    });
                });
        });
    },

    /**
     * 登出模块
     * @param req
     * @param res
     */
    loginOut:function(req,res) {
        delete req.session.user;
        delete res.locals.user;
        res.redirect('/movie')
    },

    userList:function(req,res) {
        User.fetch(function(err,users){
            if(err){
                console.log(err);
            }
            res.render('user/userList',{
                title:'用户列表',
                users:users
            })
        })
    },

    loginRequired:function(req,res,next){
        var user = req.session.user;

        if(!user){
            return res.redirect('/user/register')
        }
        next();
    },

    adminRequired:function(req,res,next){
        var user = req.session.user;
        if(user.role <= 10) {
            return res.redirect('/user/login')
        }
        next();
    }
};