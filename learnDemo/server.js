const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');


var server = express();
server.listen(8080);

//获取请求数据
//get自带
server.use(bodyParser.urlencoded());
const multerObj = multer({dest: './static/upload'});
server.use(multerObj.any());

//cookie,session
server.use(cookieParser());
(function(){
	var keys = [];
	for (var i = 0; i < 100; i++) {
		keys[i] = 'a_'+Math.random();
	}
	server.use(cookieSession({
		name: 'sess_id',
		keys: keys,
		maxAge: 20*60*1000 //20 min
	}));
})();

//template
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');
//route


server.use('/admin/',require('./route/admin')());
server.use('/web/',require('./route/web')());

//default:static
server.use(static('./static/'));