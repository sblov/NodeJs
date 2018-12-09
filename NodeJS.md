# NodeJS

#### 根据请求路径访问

```javascript
console.log("nodejs");

const http = require('http');
const fs = require('fs');

var server = http.createServer(function(req,res){

	var file_name = './www'+req.url;

	fs.readFile(file_name,function(err,data){
		if (err) {
			res.write('404');
		}else {
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
server.listen(8089);
```

#### 处理GET请求

##### 	1.手动解析参数

```javascript
const http = require('http');
http.createServer(function(req,res){
		var GET = {};
	//判断是否带？请求
	if (req.url.indexOf('?') != -1) {
		var arr = req.url.split('?');
		var url = arr[0];
		//arr[0] : 地址 '/index'
		//arr[1] : 数据 'user=xxx&password=xxx'
	
		var arr2 = arr[1].split('&');
		//arr2 : ['user=xxx','password=xxx']

		for (var i = 0; i < arr2.length; i++) {
				var arr3 = arr2[i].split('=');
				//arr3[0] : 'user'
				//arr3[1] : 'xxx'
				GET[arr3[0]] = arr3[1];

		}
	 }else {
	 	var url = req.url;
	 }

	console.log(url,GET);
	res.write('index');
	res.end();

}).listen(8081);
```

##### 	2.querystring解析参数

```javascript
const http = require('http');
const querystring = require('querystring');

http.createServer(function(req,res){
		var GET = {};
	//判断是否带？请求
	if (req.url.indexOf('?') != -1) {
		var arr = req.url.split('?');
		var url = arr[0];
		//arr[0] : 地址 '/index'
		//arr[1] : 数据 'user=xxx&password=xxx'
		//通过querystring解析请求参数
		GET = querystring.parse(arr[1]);
		
	 }else {
	 	var url = req.url;
	 }

	console.log(url,GET);
	res.write('index');
	res.end();

}).listen(8081);
```

##### 	3.url解析参数

```javascript
const http = require('http');
const urlLib = require('url');

http.createServer(function(req,res){
	//通过url直接对请求进行解析，true参数表示将参数解析至json
	var obj = urlLib.parse(req.url,true);

	var url = obj.pathname;
	var GET = obj.query;

	console.log(url,GET);
	res.write('index');
	res.end();

}).listen(8081);
```

#### 处理POST请求

```javascript
const http = require('http');	

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
    
   	res.write('index');
	res.end();

}).listen(8081);
```

#### 整合

```javascript
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
		str += data;
	});
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
```

#### 简单登录注册

```javascript
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
```

#### 自定义模块

**require:** 引入模块
	对于自定义模块，将js文件放入**node_modules**文件夹下，在引入时可以忽略**“./”**,	模块查询路径：系统模块优先，后本地模块

**exports：**输出数据

**module：**类似exports

```javascript
//引入自定义模块 : ./
//输出数据： exports
//
//require: 引入模块
//	对于自定义模块，将js文件放入node_modules文件夹下，在引入时可以忽略./,
//	模块查询路径：系统模块优先，后本地模块

/*
exports.a = 1;
exports.b = 2;
exports.c = 3;
*/

module.exports = {a: 1,b: 2,c: 3};
console.log(module.exports == exports);
```

```javascript
var mod  = require('./mod.js')//.js后缀可省略

console.log(mod.a);
```

#### **npm(NodeJS Package Manager)**

```javascript
安装需要js模块
npm install XXX
npm uninstall XXX
npm login
npm init
发布自定义模块
npm publish
npm update
npm --force unpublish
```

#### **Express框架**

```javascript
//简化请求处理
npm install express
//处理静态资源
npm install express-static
```

##### GET：

```javascript
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


```

##### POST：

my-body-parser:

```javascript
const queryString =  require('querystring');

module.exports = function(req, res, next){
	// console.log('a');

	var str = '';

	req.on('data',function(data){
		str += data;
	});
	req.on('end',function(){
		req.body = queryString.parse(str);
		
		next();
	})

}
```

```javascript
const express = require('express');
const bodyParser = require('body-parser');
//自定义post解析模块js
const myParser = require('./mylib/my-body-parser');

var server  = express();
server.listen(8080);

//1.----------------
/*server.use(bodyParser.urlencoded({
	extended: true, //扩展模式
	limit: 100		//post大小限制，默认100k

}));*/

//2.----------------
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

//3.------------------
server.use('/',myParser);

server.use('/',function(req,res){
	
	console.log(req.body);//POST 这里的body属性是bodyparser过程中加入的
	console.log(req.query);//GET
});
```

##### Cookie&Session

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

var server  = express();
server.listen(8080);

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
```

##### 模板引擎

###### jade

​	根据缩进，规定层级
	属性放()中，多个属性','隔开
	标签后空格可直接加内容
	对于style属性，可使用json格式
	对于class属性，可使用数组格式
	&attributes:表示后面的属性格式为json

```javascript
html
	head
		style
		script(src="a.js")
		link(href="a.ss" ,ref="stylesheet")
		script alert('jade');
	body
		div!=content
		-for(var i=0;i<cla.length;i++)
			div=cla[i]
		div(style=json)
			- var classes = ['foo', 'bar', 'baz']
			a(class=classes)
			a(class=cla)
			a=a
		div myName:#{name+a}
		div
			ul
				li lov_1
					a a_lov
				li lov_2
				li lov_3
		div(style="width:200px;height:200px;background:red")
		div(style={width: '200px',height: '200px',background: 'red'})
		div(class="aa bb cc")
		div(class=['aa','bb','cc'])
		div.content
		div#content
		div&attributes({title: 't1',id: 'i1'})
		div
			|1
			|2
			|3
		div.
			1
			2
			3
		div
			include 1.ejs

```

```javascript
const fs = require('fs');
const jade = require('jade');

//<html></html>
//var str  = jade.render('html');

var str = jade.renderFile('./www/1.jade',{pretty: true});

fs.writeFile('./www/jade.html',str,function(err){
	if(err){
		console.log("write error");
	}else{
		console.log("write success");
	}
})
console.log(str);

```

**jade_demo**

```javas
doctype
html
	head
		meta(chrset='utf-8')
		title jade_index
		style.
			div{
				width: 100px;
				height: 100px;
				background: #ccc;
				text-align: center;
				lint-height: 100px;
				float: left;
				margin: 10px auto
			}
			div.last{
				clear: left
			}
	body
		-var a=0;
		while a<12
			if(a%4==0 && a!=0)
				div.last=a++
			else
				div=a++
```

###### ejs

```javascript
const ejs = require('ejs');

var str = ejs.renderFile('./www/1.ejs',{msg: 'message',
	json:{arr:[
		{user: 'lov1'},
		{user: 'lov2'},
		{user: 'lov3'}]},
		htm: '<a>htm</a>'
},function(err , data){
	if(err){
		console.log('compile error');
	}else{
		console.log(data);
	}
})
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<%= msg %>
	<%= json.arr[0].user %>
	<% for(var i =0;i<json.arr.length;i++){ %>
		<a><%= json.arr[i].user %></a>
	<% } %>
	<%- htm %>
	<% include login.html %>
</body>
</html>
```

##### 文件上传

`body-parser`		解析post数据（application/x-www-form-urlencoded）

`multer`		解析post文件（multipart/form-data）

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const pathLib = require('path');

//dest属性：上传存储地址
var objMulter = multer({dest: './www/file/'});

var server = express();
server.listen(8080);

server.use(bodyParser.urlencoded({extended: false}));
server.use(objMulter.any());//对所有文件上传响应

server.post('/',function(req,res){
	console.log(req.body);
	console.log(req.files);

	//上传文件添加后缀
	var newName = req.files[0].path + pathLib.parse(req.files[0].originalname).ext;
	fs.rename(req.files[0].path,newName,function(err){
		if(err){
			res.send('rename error');
		}else{
			res.send('success');
		}
	})

```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<form action="http://localhost:8080/" method="post" enctype="multipart/form-data">
		file:<input type="file" name="f1" /><br>
		<input type="submit" value="upload">
	</form>
	
</body>
</html>
```

![](C:\Users\Administrator\Desktop\Web\JS\Node\multer.png)

##### consolidate整合

​	各种模板引擎对express提供统一接口

```javascript
// const ejs = require('ejs');
// const jade = require('jade');
// consolidate代替所有模板引擎引入
const consolidate = require('consolidate');
```

```javascript
//配置模板引擎
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
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	Name: <%= name %>
</body>
</html>
```

##### Router

​	将不同模块的访问分不同目录，在路由中可嵌套路由

```javascript
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
```

##### mysql连接

```javascript
//引入mysql模块
const mysql = require('mysql');

//建立连接
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '997103',
	database: 'node',
	port: '3307'
});

//查询并进行回调函数
db.query('select * from user',(err,data)=>{
	if(err){
		console.log(err);

	}else{
		console.log(data);
	}
})
```

##### MD5

```javascript
const crypto = require('crypto');

var obj = crypto.createHash('md5');
obj.update('123456');
// console.log(obj);
//以十进制输出
var str = obj.digest('hex');
console.log(str);
```



