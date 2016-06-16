var when = require('when');
var Movie = require('../models/movie');
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')

module.exports = {
  all: function (req, res) {
    Category
      .find({})
      .populate({path: 'movies', options: {limit:5}})
      .exec(function(err, categories){
        if (err) return;
        res.render('movie/index', {
          title: '电影首页',
          categories: categories
        })
      })
  },
  new: function (req, res) {
    Category.find({}, function(err, categories){
      res.render('movie/adminEnter', {
        title: '增加一部电影',
        movie: {},
        categories:categories
      })
    });
  },
  postNew: function (req, res) {

    var movieObj = req.body.movie;

    var _movie = new Movie(movieObj);
    var categoryName = movieObj.categoryName;//自定义分类名称的字段,电影schema中没有对应的属性
    var categoryId = movieObj.category;//从项目中原有的分类字段中选择的一项作为当前movie的分类
    if(categoryId) {
      console.log('####从现有分类中选择了一项作为当前电影分类');
      _movie.save(function (err, movie) {
        if (err) console.log(err);
        Category.findById(categoryId, function(err, category){
          category.movies.push(movie._id);
          category.save(function(err){
              if (err) console.log(err);
              res.redirect('/movie/detail/' + movie._id);
          })
        })
      });
    } else if(categoryName) {
      console.log('####根据自定义的分类名称创建新分类');
      _movie.save(function (err, movie) {
        if (err) console.log(err);

        var categoryObj = new Category({
          name : categoryName,
          movies: [movie._id]
        });

        categoryObj.save(function(err, category){
          movie.category = category._id;
          movie.save(function(err, movies){
            res.redirect('/movie/detail/' + movies._id);
          })
        });
      });
    } else {
      console.log('不可能')
    }
  },
  delete: function (req, res) {
    var id = req.query.id;
    if (!id) return;
    Movie.remove({_id: id}, function (err, movies) {
      if (err) {
        console.log(err)
      } else {
        res.json({code: 0, msg: 'success'})
      }
    })
  },
  detail: function (req, res) {
    /**
     * populate方法
     * 如果如下函数中不使用populate('from','username'),则from字段仅保存一个user对象的_id字段值（from: 568e1ca039b2f528168f9d43）
     *
     * 然而，一旦使用了populate('from','username'),则from字段就自动提升为了一个user对象，同时拥有了username属性from: { meta: {}, username: 'admin', _id: 568e1ca039b2f528168f9d43 }
     * 所以需要什么字段，就可以通过populate的方法，将引用Schema中的字段放入当前from中
     */
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
      Comment
        .find({movie: id})
        .populate('from', 'username')//将from指向的User文档中的username属性提取到当前的from对象中，前端直接使用from.username
        .populate('reply.from reply.to', 'username')
        .exec(function (err, comments) {
            /*
               comments ->
               { reply: [],
               meta:
               { createAt: Sun Jun 12 2016 23:13:12 GMT+0800 (中国标准时间),
               updateAt: Sun Jun 12 2016 23:13:12 GMT+0800 (中国标准时间) },
               __v: 0,
               content: 'ffff',
               from: { meta: {}, username: 'feng', _id: 5688a75f75f1ba400e48719f },
               movie: 57598f5dbba76e840579344d,
               _id: 575d7c08fd819a9419ea3d20 }
             */
          res.render('movie/detail', {
            title: '电影详情页',
            movie: movie,
            comments: comments
          })
        });
    })
  },
  update: function (req, res) {
    var id = req.params.id;
    if (id) {
      Movie.findById(id, function (err, movie) {
        Category.find({},function(err, categories){
          if (err) {
            console.log(err)
          } else {
            res.render('movie/adminUpdate', {
              title: '修改电影内容',
              movie: movie,
              categories: categories
            })
          }
        })
      })
    }
  },
  postUpdate: function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    Movie.findById(id, function (err, movie) {
      if (err) console.log(err);
      _movie = _.extend(movie, movieObj);
      _movie.save(function (err, movie) {
        res.redirect('/movie/detail/' + movie._id)
      })
    })
  },
  list: function (req, res) {
    Movie.fetch(function (err, movies) {
      if (err) return;
      res.render('movie/list', {
        title: '后台管理页',
        movies: movies
      })
    })
  },
  search: function (req, res) {
    var catId = req.query.cat;
    var page = parseInt(req.query.p) || 0;//当前页码
    var count = 2;//每页多少数据
    var index = page * 2;//起始值
    var q = req.query.q;//搜索输入值

    if(catId) {
      Category.find({_id: catId})
          .populate({
            path: 'movies',
            select: 'title poster'//引用movies的数据，选出title poster数据；关联整个对象，取出某几个值
          })
          .exec(function(err, categories){
            if(err) console.log(err);
            /*
             console.log(categories)
             =>
             [ { movies:
             [ { meta: {},
             poster: 'https://img1.doubanio.com/view/movie_poster_cover/lpst/public/p494268647.jpg',
             title: '机器人9号',
             _id: 5755944f8efb473011d4391b } ],
             meta:
             { createAt: Mon Jun 06 2016 22:24:54 GMT+0800 (中国标准时间),
             updateAt: Mon Jun 06 2016 23:18:39 GMT+0800 (中国标准时间) },
             __v: 1,
             name: '战争题材',
             _id: 575587b6ba60610c0a58b889 } ]*/
            var category = categories[0] || {};
            var movies = category.movies || [];
            var results = movies.slice(index, index + count);

            res.render('movie/searchResult', {
              title: '结果列表页',
              movies: results,
              currentPage: page + 1,
              query: 'cat=' + catId,
              totalPage: Math.ceil(movies.length / count),
              keyword: category.name
            })
          })
    } else {
      Movie
          .find({title: new RegExp(q + '.*','i')})
          .exec(function(err, movies){
            if(err) console.log(err);
            var results = movies.slice(index, index + count);

            res.render('movie/searchResult', {
              title: '结果列表页',
              movies: results,
              currentPage: page + 1,
              query: 'q=' + q,
              totalPage: Math.ceil(movies.length / count),
              keyword: q
            })
          })
    }

  }
};