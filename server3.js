const fs = require('fs');
/*
	jade:
		根据缩进，规定层级
		属性放()中，多个属性','隔开
		标签后空格可直接加内容
		对于style属性，可使用json格式
		对于class属性，可使用数组格式
		&attributes:表示后面的属性格式为json
 */
// const jade = require('jade');

//<html></html>
//var str  = jade.render('html');

/*var str = jade.renderFile('./www/1.jade',{pretty: true,name: 'lov',a: 2,
		json: {width: '200px',height: '200px',background: 'red'},
		cla: ['aa', 'bb', 'cc'],
		content: '<h1>content</h1>'
	});*/
/*var str = jade.renderFile('./www/1.jade',{pretty: true});

fs.writeFile('./www/jade.html',str,function(err){
	if(err){
		console.log("write error");
	}else{
		console.log("write success");
	}
})
console.log(str);*/

const ejs = require('ejs');

var str = ejs.renderFile('./www/1.ejs',{msg: 'message',
	json:{arr:[
		{user: 'lov1'},
		{user: 'lov2'},
		{user: 'lov3'}]},
		htm: '<a>htm</a>'
},function(err , data){
	if(err){
		console.log('compile error');
	}else{
		console.log(data);
	}
})