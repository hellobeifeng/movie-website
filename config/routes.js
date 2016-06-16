var controller = require('../controllers');
module.exports = function (app) {
  app.use(function (req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });


  app.get('/', controller.website.index);//首页
  app.get('/douban/movie/:id', controller.doubanMovie.detail);//request请求豆瓣API
  /*
   * movie模型
   */
  app.get('/movie', controller.movie.all);//电影首页
  app.get('/movie/new', controller.user.loginRequired, controller.user.adminRequired, controller.movie.new);//添加电影页面(管理员权限)
  app.post('/movie/new', controller.user.loginRequired, controller.user.adminRequired, controller.movie.postNew);//提交一部电影(管理员权限)
  app.get('/movie/update/:id', controller.user.loginRequired, controller.user.adminRequired, controller.movie.update);//更新电影页面(管理员权限)
  app.post('/movie/update', controller.user.loginRequired, controller.user.adminRequired, controller.movie.postUpdate);//提交更新电影(管理员权限)
  app.get('/movie/list', controller.user.loginRequired, controller.user.adminRequired, controller.movie.list);//后台电影管理列表(管理员权限)
  app.delete('/movie/list', controller.user.loginRequired, controller.user.adminRequired, controller.movie.delete);//删除一部电影(管理员权限)
  app.get('/movie/detail/:id', controller.movie.detail);//查看一部电影详情
  app.get('/movie/search', controller.movie.search);//查询结果
  /*
   * user模型
   */
  app.get('/user/login', controller.user.login);
  app.post('/user/login', controller.user.postLogin);
  app.get('/user/logout', controller.user.loginOut);
  app.get('/user/register', controller.user.register);
  app.post('/user/register', controller.user.userExist, controller.user.postRegister);
  app.get('/user/userList', controller.user.loginRequired, controller.user.adminRequired, controller.user.userList);

  /**
   * comment模型
   */
  app.post('/comment/new', controller.user.loginRequired, controller.comment.postNew);//提交一个评论

  /**
   * category模型
   */
  app.get('/category/new', controller.user.loginRequired, controller.category.new);//提交一个评论
  app.post('/category/new', controller.user.loginRequired, controller.category.postNew);//提交一个评论
  app.get('/category/list', controller.user.loginRequired, controller.category.list);//提交一个评论

};

