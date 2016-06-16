var Movie = require('../models/movie');
var Category = require('../models/category')
var _ = require('underscore')

module.exports = {

  new: function (req, res) {
    res.render('category/adminEnter', {
      title: '增加一个分类',
      category: {}
    })
  },
  postNew: function (req, res) {
    var categoryObj = req.body.category;
    var _category = new Category(categoryObj);//本初new 了一个评论Model
    _category.save(function (err, category) {
      if (err) console.log(err);
      res.redirect('/category/list/');
    });
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
  update: function (req, res) {
    var id = req.params.id;
    if (id) {
      Movie.findById(id, function (err, movie) {
        if (err) {
          console.log(err)
        } else {
          res.render('movie/adminUpdate', {
            title: '修改电影内容',
            movie: movie
          })
        }
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
    Category.fetch(function (err, categories) {
      if (err) return;
      res.render('category/list', {
        title: '后台管理页-电影分类',
        categories: categories
      })
    })
  }
};