const express = require('express');
const common = require('../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	port: '3307',
	user: 'root',
	password: '997103',
	database: 'learn'
});

module.exports = function(){
	var router = express.Router();

	router.use((req,res,next)=>{
		if(!req.session['admin_id'] && req.url != '/login'){

			res.redirect('/admin/login');
		}else{
			console.log(req.session['admin_id']);
			next();
		}
	});
	router.get('/login',(req,res)=>{
		res.render('admin/login.ejs',{});
	});

	router.post('/login',(req,res)=>{
		// console.log(req.body);
		var username = req.body.username;
		var password = common.md5(req.body.password+common.MD5_SUFFIX);

		db.query('select * from admin_table where username=? ',username,(err,data)=>{
			if(err){
				console.log(err);
				res.status(500).send('database error').end();
			}else{
				if (data.length==0) {
					res.status(400).send('no the admin').end();
				}else{
					if(data[0].password == password){
						//success
						req.session['admin_id'] = data[0].id;
						res.redirect('/admin/');
					}else{
						res.status(400).send('password is error').end();
					}
				}
			}
		});	
	});

	router.get('/',(req,res)=>{
		// res.send('welcome admin').end();
		res.render('admin/index.ejs',{});
	});

	router.get('/banners',(req,res)=>{
		switch(req.query.act){
			case 'mod':
				break;
			case 'del':
				db.query('delete from banner_table where id=?',req.query.id,(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						// res.send('ok').end();
						//res.render('admin/banners.ejs',{banners: data});
						res.redirect('/admin/banners');
					}
				});
				break;
			default:
				db.query('select * from banner_table',(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						// res.send('ok').end();
						res.render('admin/banners.ejs',{banners: data});
					}
				});

		}
		// res.send('welcome admin').end();
		

		//res.render('admin/banners.ejs',{});
	});

	router.post('/banners',(req,res)=>{
		var title = req.body.title;
		var description = req.body.description;
		var href = req.body.href;

		console.log(title,description,href);
		if(!title || !description || !href){
			res.status(400).send('arg error').end();
		}else{
			db.query('insert into banner_table (title,description,href) value(?,?,?)',[title,description,href],(err,data)=>{
				if(err){
					console.error(err);
					res.status(500).send('database error').end();
				}else{
					// res.send('ok').end();
					res.redirect('/admin/banners');
				}
			});
		}
	});


	return router;
};