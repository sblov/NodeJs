/*
* @Author: Administrator
* @Date:   2018-11-26 22:49:29
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-28 21:23:37
*/
console.log("nodejs");

const http = require('http');
//文件操作
const fs = require('fs');
//string操作
const querystring = require('querystring');
//url操作
const urlLib = require('url');


var server = http.createServer(function(req,res){

	//GET
	var obj = urlLib.parse(req.url,true);
	var url = obj.pathname;
	var GET = obj.query;

	console.log(url,GET);

	//POST
	var str = '';
	var POST = '';
	req.on('data',function(data){
		str += data;	});
	req.on('end',function(){
		var POST = querystring.parse(str);
		console.log(POST);
	});


	//文件请求
	var file_name = './www'+url+'.html';
	fs.readFile(file_name,function(err,data){
		if(err){
			res.write('<h1>404</h1>');
		}else {
			res.write(data);
		}
		res.end();
	});
});

server.listen(8080);

/*
http.createServer(function(req,res){
	//POST接受数据
	var str = '';

	var i = 0;
	//data : 有一段数据到达，触发执行一次
	req.on('data',function(data){
		console.log(i++);
		str += data;
	});
	//end : 数据全部到达后执行
	req.on('end',function(){
		console.log(str);
	});

//-------------------------------------------------------------------------
	//通过url直接对请求进行解析，true参数表示将参数解析至json
	// var obj = urlLib.parse(req.url,true);
	//
	// var url = obj.pathname;
	// var GET = obj.query;

/*
	var GET = {};

	if (req.url.indexOf('?') != -1) {
		var arr = req.url.split('?');
		var url = arr[0];
		//arr[0] : 地址 '/index'
		//arr[1] : 数据 'user=xxx&password=xxx'
		//通过querystring解析请求参数
		GET = querystring.parse(arr[1]);*/

/*
		var arr2 = arr[1].split('&');
		//arr2 : ['user=xxx','password=xxx']

		for (var i = 0; i < arr2.length; i++) {
				var arr3 = arr2[i].split('=');
				//arr3[0] : 'user'
				//arr3[1] : 'xxx'
				GET[arr3[0]] = arr3[1];

		}*/
	// }else {
	// 	var url = req.url;
	// }

	// console.log(url,GET);
	/* res.write('index');
	 res.end();

}).listen(8081);
//--------------------------------------------------------------------
/*
var server = http.createServer(function(req,res){

	var file_name = './www'+req.url;
	//文件读取
	fs.readFile(file_name,function(err,data){
		if (err) {
			res.write('404');
		}else {
			//文件写
			res.write(data.toString());
		}
		res.end();



	});


	// switch(req.url){
	// 	case '/index.html':
	// 		res.write("<h1>index</h1>");
	// 		break;
	// 	default:
	// 		res.write("<h1>404</h1>");
	// 		break;
	//
	// }
	//
	// res.end();

});

//监听端口
server.listen(8089);*/
