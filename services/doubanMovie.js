var http = require('./http');

var doubanMovie = {
	info:function(id){
		var url = 'https://api.douban.com/v2/movie/subject/' + id;
		console.log(url);
		return http.getJson(url);
	}
}

module.exports = doubanMovie;