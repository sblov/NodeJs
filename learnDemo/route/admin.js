const express = require('express');
const common = require('../libs/common');


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

	router.use('/login',require('./admin/login')());

	
	router.get('/',(req,res)=>{
		// res.send('welcome admin').end();
		res.render('admin/index.ejs',{});
	});

	router.use('/banners',require('./admin/banner')());

	router.use('/custom',require('./admin/custom')());
	
	


	return router;
};