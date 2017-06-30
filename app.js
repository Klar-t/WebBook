var koa=require('koa');
var controller=require('koa-route');
var app=koa();

var views=require('co-views');
var render=views('./view',{
	map:{
		html:'ejs'
	}
});

var koa_static=require('koa-static-server');
var service=require('./service/webAppservice.js');
app.use(koa_static({
	rootDir:'./static/',
	rootPath:'/static/',
	maxage:0
}));


app.use(controller.get('/route_test',function*(){
	this.set('Catch-Control','no-cache');
	this.body='hello koa!';
}));

//模板
app.use(controller.get('/ejs_test',function*(){
	this.set('Catch-Control','no-cache');
	this.body=yield render('test',{title:'title_test'});
}));
app.use(controller.get('/',function*(){
	this.set('Catch-Control','no-cache');
	this.body=yield render('index',{title:'书城首页'});
}));
app.use(controller.get('/seach',function*(){
	this.set('Catch-Control','no-cache');
	this.body=yield render('seach',{title:'搜索页面'});
}));

var querystring=require('querystring');
app.use(controller.get('/book',function*(){//书籍页面
	this.set('Catch-Control','no-cache');
	var params=querystring.parse(this.req.parsedUrl.query);
	var bookId=params.id;
	this.body=yield render('book',{ title:bookId });
}));








app.use(controller.get('/ajax/index',function*(){//ajax 访问到文件数据
	this.set('Catch-Control','no-cache');
	this.body =service.get_index_data();
}));
app.use(controller.get('/ajax/rank',function*(){//ajax 访问到文件数据
	this.set('Catch-Control','no-cache');
	this.body =service.get_rank_data();
}));

//ajax 访问系统文件
app.use(controller.get('/api_test',function*(){
	this.set('Catch-Control','no-cache');
	this.body = service.get_test_data();
}));

app.use(controller.get('/ajax/book',function*(){
	this.set('Catch-Control','no-cache');
	var querystring=require('querystring');
	var params=querystring.parse(this.req._parsedUrl.query);
	var id=params.id;
	if(!id){
		id="";
	}
	this.body = service.get_book_data(id);
}));

//使用线上的接口
app.use(controller.get('/ajax/search',function*(){
	this.set('Catch-Control','no-cache');
	var _this=this;
	var querystring=require('querystring');
	var params=querystring.parse(this.req._parsedUrl.query);
	var start=params.start;
	var end=params.end;
	var keyword=params.keyword;
	this.body = yield service.get_search_data(start,end,keyword);
}));




app.listen(3001);
console.log('koa server is started 3001');
