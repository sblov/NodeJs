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
		res.render('admin/login.ejs',{});
	});

	router.post('/',(req,res)=>{
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
	return router;

};