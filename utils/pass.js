// check out https://github.com/visionmedia/node-pwd

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

exports.hash = function (pwd, salt, fn) {
    if (3 == arguments.length) {
        //hash(pass, user.salt, function (err, hash) {
        //根据密码和盐生成哈希值，用于   “登录”    验证
        //密码，盐，迭代次数，指定长度，回调
        //回调函数为function(err,hash)
        crypto.pbkdf2(pwd, salt, iterations, len, fn);
    } else {
        //hash(userObj.password, function (err, salt, hash)
        //根据表单密码和随机生成的盐生成哈希值，用于 “注册” 保存哈希值如User模型
        //回调函数 fn(null, salt, hash);
        fn = salt;
        crypto.randomBytes(len, function (err, salt) {//生成一个随机长度的字符串
            if (err) return fn(err);
            salt = salt.toString('base64');
            crypto.pbkdf2(pwd, salt, iterations, len, function (err, hash) {
                if (err) return fn(err);
                fn(null, salt, hash);
            });
        });
    }
};
