/*
* @Author: Administrator
* @Date:   2018-12-03 22:55:57
* @Last Modified by:   Administrator
* @Last Modified time: 2018-12-04 22:57:00
*/
const express = require('express');
const expressStatic = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
// const ejs = require('ejs');
// const jade = require('jade');
// consolidate代替所有模板引擎引入
const consolidate = require('consolidate');

var server = express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('qwer'));
//2.使用session
var keys = [];
for(var i=0;i<10;i++){
	keys.push('keys_'+Math.random());
}
server.use(cookieSession({
	name: 'lov_session',
	keys: keys,
	masAge: 20*3600*1000
}))

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/file'}).any());
//请求
/*server.use('/login',function(req,res,next){
	console.log(req.query,req.body,req.files,req.cookies,req.session);
})*/
//4.配置模板引擎
//输出的内容
server.set('view engine','html');
//模板文件的位置
server.set('views','./views');
//指定模板引擎
server.engine('html',consolidate.ejs);
//接收请求
server.get('/index',function(req,res){
	res.render('csl.ejs',{name: 'lov'});
})


//5.static数据
server.use(expressStatic('./www'));