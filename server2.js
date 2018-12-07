/*
* @Author: Administrator
* @Date:   2018-11-30 20:04:27
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-30 21:53:03
*/

const express = require('express');

const bodyParser = require('body-parser');
const myParser = require('./mylib/my-body-parser');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

var server  = express();
server.listen(8080);

/*server.use(bodyParser.urlencoded({
	extended: true, //扩展模式
	limit: 100		//post大小限制，默认100k

}));*/


//bodyParser实现原理
/*server.use('/',function(req, res, next){
	console.log('a');

	var str = '';

	req.on('data',function(data){
		str += data;
	});
	req.on('end',function(){
		req.body = queryString.parse(str);
		
		next();//产生链式效果
	})

});*/

/*server.use('/',myParser);

server.use('/',function(req,res){
	
	console.log(req.body);//POST 这里的body属性是bodyparser过程中加入的
	console.log(req.query);//GET
});*/

//req.cookies
//在这里指定签名方式可不单独设置secret，内部执行一样
//同时可以对读取的cookie进行签名解析，得出未签名的原始cookie
//当不设置时，从cookies能直接读取签名后的cookie，设置后只能通过signedCookies读取被签名的cookie
//

server.use(cookieParser('dhsfj'));

server.use(cookieSession({
	name: 'sess',	//设置session名字
	keys: ['aaa','bbb','ccc'], //session签名
	maxAge: 20*60*1000	//session有效时间
}));

server.use('/www',function(req,res){

	//console.log(req.cookies);//会同时访问子路径的cookie

	//res.cookie('user','lov');
	//res.cookie('msg','msg',{path: '/www',maxAge: 3*60*1000});//path为访问路径时cookie才生效，maxAge为有效时间。单位为毫秒

	//通过设置secret为cookie添加签名的方式，同时在cookie设置中开启signed
	//req.secret = 'dhsfj';
	//res.cookie('user','lov',{signed: true});

	//console.log(req.signedCookies);//读取被签名cookie
	//console.log(req.cookies);//未签名cookie
	//res.clearCookie('user');//清除指定cookie
	//
	
	if (req.session['count'] == null) {
		req.session['count'] = 0;
	}else{
		req.session['count']++;
	}
	console.log(req.session['count']);

	res.send('ok');

});