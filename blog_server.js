const express=require('express');
const static=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');
const common = require('./mylib/common.js');

//连接池
const db=mysql.createPool({host: 'localhost',port: '3307',user: 'root', password: '997103', database: 'blog'});

var server=express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('qwert'));

//2.使用session
var keys=[];
for(var i=0;i<100;i++){
  keys.push('keys_'+Math.random());
}
server.use(cookieSession({name: 'blog_sess', keys: keys, maxAge: 20*3600*1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());

//4.配置模板引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './template');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//接收用户请求
server.get('/', (req, res,next)=>{
  //查询banner的东西
  db.query("SELECT * FROM banner_table", (err, data)=>{
    if(err){
      console.log(err);
      res.status(500).send('database error').end();
    }else{
      // console.log(data);
      //res.render('index.ejs', {banners: data});
      res.banners = data;

      next();
    }
  });
});
server.get('/', (req, res,next)=>{
  //查询article的东西
  // console.log(res.banners);
  db.query('select id,title,summary from article_table',(err,data)=>{
    if (err) {
      res.status(500).send('database error').end();
    }else{
      res.article = data;

      next();
    }
  });
});
server.get('/',(req,res)=>{
  res.render('index.ejs',{banners: res.banners,article: res.article});
});
server.get('/article',(req,res)=>{
  if(req.query.id){
    if(req.query.act == 'like'){
      db.query('update article_table set n_like=n_like+1 where id=?',req.query.id,(err,data)=>{
        if(err){
          console.log(err);
          res.status(500).send('database error').end();

        }else{
            // 显示文章
            db.query('select * from article_table where id=?',req.query.id,(err,data)=>{
              if(err){
                res.status(500).send('database error').end();
              }else{
                if(data.length == 0 ){
               res.status(404).send('404').end();
              }else{
                var articleData =  data[0];
                articleData.sDate = common.time2date(articleData.post_time);
                articleData.content = articleData.content.replace(/^/gm,'<p>').replace(/$/gm,'</p>');

                res.render('conText.ejs',{article_data: articleData});
              }
              }
            });
        }
      });
    }else{
      // 显示文章
            db.query('select * from article_table where id=?',req.query.id,(err,data)=>{
              if(err){
                res.status(500).send('database error').end();
              }else{
                if(data.length == 0 ){
               res.status(404).send('404').end();
              }else{
                var articleData =  data[0];
                articleData.sDate = common.time2date(articleData.post_time);
                articleData.content = articleData.content.replace(/^/gm,'<p>').replace(/$/gm,'</p>');

                res.render('conText.ejs',{article_data: articleData});
              }
              }
            });
    }
    
  }else{
    req.status(404).send('404').end();
  }


  // res.render('conText.ejs',{});
});




//4.static数据
server.use(static('./www'));
