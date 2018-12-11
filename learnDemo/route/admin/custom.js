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
				db.query('select * from custom_evaluation_table where id=?',req.query.id,(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else if (data.length == 0) {
						res.status(404).send('data no found').end();
					}else{
						db.query('select * from custom_evaluation_table',(err,bdata)=>{
							if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else{
								// res.send('ok').end();
								console.log(data);
								res.render('admin/custom.ejs',{custom: bdata,mod_data: data});
							}
						});
					}
				});
				break;
			case 'del':
				db.query('delete from custom_evaluation_table where id=?',req.query.id,(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						fs.unlink('static/upload/'+req.query.src,(err)=>{
							if (err) {
								res.status(500).send('unlink error').end();
							}else{
								res.redirect('/admin/custom');
								
							}
						});
						// res.send('ok').end();
						//res.render('admin/banners.ejs',{banners: data});
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
		
		if (req.files[0]) {

			var ext = pathLib.parse(req.files[0].originalname).ext;

			var oldPath = req.files[0].path;
			var newPath = req.files[0].path+ext;

			var newFileName = req.files[0].filename+ext;
		}else{
			var newFileName = null;
		}

		if(newFileName){

			fs.rename(oldPath,newPath,(err)=>{
				if(err){
					res.status(500).send('file opration error').end();
				}else{
					if(req.body.mod_id){
						fs.unlink('static/upload/'+req.body.mod_src,(err)=>{
							if (err) {
								console.log(err);
								res.status(500).send('unlink error').end();
							}else{
								db.query('update custom_evaluation_table set title=?,description=?,src=? where id=?',[title,description,newFileName,req.body.mod_id],(err)=>{
										if(err){
												console.error(err);
												res.status(500).send('database error').end();
												}else{
													// res.send('ok').end();
													res.redirect('/admin/custom');
												}
								});
								
								
							}
						});
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
		}else{
			db.query('update custom_evaluation_table set title=?,description=? where id=?',[title,description,req.body.mod_id],(err)=>{
					if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else{
								// res.send('ok').end();
								res.redirect('/admin/custom');
							}
			});
		}
		
	});

	return router;
};