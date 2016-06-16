var doubanMovie = require('../services/doubanMovie');
var when = require('when');

module.exports = {
    detail: function (req, res) {
        var id = req.params.id;
        doubanMovie.info(id)
            .then(function (result) {
                var detail = result;
                console.log(detail);
                res.render('/movie/douban', {
                    detail:detail.summary
                })
            })
    },
    new:function (req,res) {

    }
}