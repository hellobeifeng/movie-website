//依赖类库
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//连接数据库
mongoose.connect('mongodb://localhost/immoc');

//配置开关 && 中间件
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret:'feng',
	store:new MongoStore({
		url:'mongodb://localhost/immoc',
		collection:'sessions'
	}),
	resave: false,
	saveUninitialized: true,
}));

//路由
require('./config/routes')(app);


//错误处理
app.use(function(req,res,next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err)
});
//if(app.get('env') === 'dev') {
	app.use(function(err,req,res,next){
		res.render('error_dev', {
			message: err.message,
			error: err
		});
	});
//}


//开启服务
app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:'+app.get('port'))
});