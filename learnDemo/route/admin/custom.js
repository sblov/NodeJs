const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');
const fs = require('fs');
const pathLib = require('path');

var db = mysql.createPool({
	host: 'localhost',
	port: '3307',
	user: 'root',
	password: '997103',
	database: 'learn'
});

module.exports = function(){
	var router = express.Router();

	router.get('/',(req,res)=>{
		switch(req.query.act){
			case 'mod':
				
				break;
			case 'del':
				db.query('delete from custom_evaluation_table where id=?',req.query.id,(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						// res.send('ok').end();
						//res.render('admin/banners.ejs',{banners: data});
						res.redirect('/admin/custom');
					}
				});
				break;
			default:
				db.query('select * from custom_evaluation_table',(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						// res.send('ok').end();
						res.render('admin/custom.ejs',{custom: data});
					}
				});

		}
		// res.send('welcome admin').end();
		

		//res.render('admin/banners.ejs',{});
	});

	router.post('/',(req,res)=>{
		var title = req.body.title;
		var description = req.body.description;
		console.log(req.files[0]);
		var ext = pathLib.parse(req.files[0].originalname).ext;

		var oldPath = req.files[0].path;
		var newPath = req.files[0].path+ext;

		var newFileName = req.files[0].filename+ext;

		fs.rename(oldPath,newPath,(err)=>{
			if(err){
				res.status(500).send('file opration error').end();
			}else{
				if(req.body.mod_id){

				}else{
					db.query('insert into custom_evaluation_table (title,description,src) value(?,?,?)',[title,description,newFileName],(err,data)=>{
						if(err){
							console.error(err);
							res.status(500).send('database error').end();
						}else{
							// res.send('ok').end();
							res.redirect('/admin/custom');
						}
					});
				}
			}
		});
		
	});

	return router;
};