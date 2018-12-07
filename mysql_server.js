/*
* @Author: Administrator
* @Date:   2018-12-04 22:31:45
* @Last Modified by:   Administrator
* @Last Modified time: 2018-12-04 23:01:15
*/
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