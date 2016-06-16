var when = require('when');
var Comment = require('../models/comment');
var _ = require('underscore')

module.exports = {
    /**
     * 如果提交的是回复,commentObj:{movie,from,cid,content,tid}
     * 如果提交的是评论，直接保存评论，commentOjb:{movie,from,content}
     * @param req
     * @param res
     */
    postNew: function (req, res) {
        var commentObj = req.body.comment;
        var movieId = commentObj.movie;

        if(commentObj.cid){
            console.log('回复');
            Comment.findById(commentObj.cid,function(err,comment){
                var reply = {
                    from:commentObj.from,
                    to:commentObj.tid,
                    content:commentObj.content
                };
                comment.reply.push(reply);
                comment.save(function(err,comment){
                    if (err) console.log(err);
                    res.redirect('/movie/detail/' + movieId);
                })
            });
        } else{
            console.log('评论');
            var _comment = new Comment(commentObj);
            _comment.save(function (err, comment) {
                if (err) console.log(err);
                res.redirect('/movie/detail/' + movieId);

            });
        }
    },
};