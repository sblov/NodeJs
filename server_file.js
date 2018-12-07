/*
* @Author: Administrator
* @Date:   2018-12-03 22:38:44
* @Last Modified by:   Administrator
* @Last Modified time: 2018-12-03 23:19:47
*/
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

})