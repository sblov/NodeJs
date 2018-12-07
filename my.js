/*
* @Author: Administrator
* @Date:   2018-11-29 22:30:05
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-29 23:42:23
*/
var mod  = require('./mod')//.js后缀可省略
var express  = require('express');
//引入express-static插件
var expressStatic = require('express-static');

//初始化数据
var users = {
	'lov': '123',
	'lov2': '123',
	'lov3': '123'
};

//声明server
var server = express();
server.listen(8080);

//处理get请求
server.get('/login',function(req,res){
	//这里的req与res非原生，是将原生进行封装，并保留原生内容

	//通过query获取参数
	var user = req.query['user'];
	var password = req.query['password'];

	if(users[user] == null){
		//比res.write()更完善，比如能直接发送json
		res.send({ok: false,msg: 'name is error'});
	}else if (users[user] != password) {
		res.send({ok: false,msg: 'password is error'});
	}else{
		res.send({ok: true,msg: 'login ok!'});
	}

	res.end();

});

//处理所有请求,通过express-static对静态资源文件请求进行处理
server.use(expressStatic('./www'));

