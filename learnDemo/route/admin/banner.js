const express = require('express');
const common = require('../../libs/common');
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

	router.get('/',(req,res)=>{
		switch(req.query.act){
			case 'mod':
				db.query('select * from banner_table where id=?',req.query.id,(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else if (data.length == 0) {
						res.status(404).send('data no found').end();
					}else{
						db.query('select * from banner_table',(err,bdata)=>{
							if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else{
								// res.send('ok').end();
								console.log(data);
								res.render('admin/banners.ejs',{banners: bdata,mod_data: data});
							}
						});
					}
				});
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

	router.post('/',(req,res)=>{
		var title = req.body.title;
		var description = req.body.description;
		var href = req.body.href;

		// console.log(title,description,href);
		if(!title || !description || !href){
			res.status(400).send('arg error').end();
		}else{
			if(req.body.mod_id){
				db.query('update banner_table set title=?,description=?,href=? where id=?',[title,description,href,req.body.mod_id],(err,data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						// res.send('ok').end();
						res.redirect('/admin/banners');
					}
				});
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
		}
		
	});

	return router;
};