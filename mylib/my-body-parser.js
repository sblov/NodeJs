/*
* @Author: Administrator
* @Date:   2018-11-30 20:23:49
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-30 20:28:36
*/

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