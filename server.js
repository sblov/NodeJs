/*
* @Author: Administrator
* @Date:   2018-11-28 21:23:54
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-28 21:53:46
*/
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

//存储用户
var users = {};

var server = http.createServer(function(req,res){
	//解析数据
	var obj = urlLib.parse(req.url,true);

	const url = obj.pathname;
	const GET = obj.query;
	
	var str = '';
	req.on('data',function(data){
		str += data;
	});
	req.on('end',function(){
		
		const POST = querystring.parse(str);
	})
	
	//区分文件与接口访问
	if(url == '/user'){//接口

		switch(GET.act){
			case 'reg'://注册
				if(users[GET.user]){
					res.write('{"ok": false,"msg": "can`t reg"}');
					
				}else{
					users[GET.user] = GET.password;
					res.write('{"ok": true,"msg": "reg ok!"}');
					
				}
				break;
			case 'login'://登录
				if(users[GET.user] == null){
					res.write('{"ok": false,"msg": "username error"}');
					
				}else if(users[GET.user] != GET.password){
					// users[GET.user] = GET.password;
					res.write('{"ok": false,"msg": "password error"}');
					
				}else{
					res.write('{"ok": true,"msg": "login ok!"}');
				}
				break;
			default:
				res.write('{"ok": false,"msg": "404"}');
				

		}
		res.end();

	}else{//文件

		//读取文件

		var file_name = './www'+url;
		fs.readFile(file_name,function(err,data){
			if (err) {
				res.write('404');
			}else{
				res.write(data);
			}
			res.end();

		});
		
	}


});

server.listen(8080);
