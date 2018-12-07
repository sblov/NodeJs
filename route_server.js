/*
* @Author: Administrator
* @Date:   2018-12-04 22:11:49
* @Last Modified by:   Administrator
* @Last Modified time: 2018-12-04 22:18:28
*/
const express = require('express');

var server = express();
server.listen(8080);
//声明特定router
var routeUser = express.Router();
//router进行接收请求
routeUser.get('/1.html',function(req,res){
	res.send('user1');
});//localhost:8080/user/1.html
routeUser.get('/2.html',function(req,res){
	res.send('user2');
});
//将router注册到server
server.use('/user',routeUser);