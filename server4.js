const fs = require('fs');

const jade = require('jade');

var str = jade.renderFile('./www/index.jade',{pretty: true});

fs.writeFile('./www/jade.html',str,function(err){
	if(err){
		console.log("write error");
	}else{
		console.log("write success");
	}
})
console.log(str);