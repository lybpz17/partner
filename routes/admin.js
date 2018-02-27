const router = require('koa-router')()
let AdminUsers = require('../models/AdminUsers')
let Users = require('../models/Users')
let  mongodb = require('mongodb');

router.prefix('/admin')		//指明分支路径

router.get('/login', async (ctx, next) => {
  await ctx.render('admin/login', {
  })
})

router.post('/login', async (ctx, next) => {
  	let email = ctx.request.body['email'];
	let pwd = ctx.request.body['pwd'];
	let rs = await AdminUsers.findOne({email:email,pwd:pwd});
	if(rs!=null){
		let user = {
			id:rs['_id'],
			nicheng:rs.nicheng,
			role:100,
		}
		ctx.session.loginbean = user;
		ctx.redirect('./identity');
	}else{
		ctx.body = '账号/密码错误';
	}
})

router.get('/identity', async (ctx, next) => {
	let loginbean = ctx.session.loginbean;

	if(loginbean&&loginbean.role==100){
		let page = 1;
		let pageShow = 3;		//每页显示条数
		if(typeof(ctx.query['page'])!='undefined'){
			page = parseInt(ctx.query['page']);
		}
		if(page<0){page=1;}
		//查询身份认证列表
		let count = await Users.count({role:1});
		let pagesum = Math.ceil(count/pageShow);
		if(pagesum>0&&page>pagesum){page=pagesum;}
		let point = (page-1)*pageShow;
		let rs = await Users.find({role:1}).skip(point).limit(pageShow);
		await ctx.render('admin/identity', {rs:rs,count:count,page:page,pagesum:pagesum});
	}else{
		ctx.body='<script>alert("session过期,请重新登录");location.href="./login";</script>';
	}
})

router.get('/identityInfo', async (ctx, next) => {
	let loginbean = ctx.session.loginbean;
	let id = ctx.query['id'];
	let _id = mongodb.ObjectID.createFromHexString(id);
	//查询身份认证列表
	let rs = await Users.findOne({_id:_id});
	if(loginbean&&loginbean.role==100){
		await ctx.render('admin/identity_info', {rs:rs});
	}else{
		ctx.body='<script>alert("session过期,请重新登录");location.href="./login";</script>';
	}
})

router.get('/reviewpass', async (ctx, next) => {
	let loginbean = ctx.session.loginbean;
	let id = ctx.query['id'];
	console.log('id:'+id);
	let _id = mongodb.ObjectID.createFromHexString(id);
	if(loginbean&&loginbean.role==100){
		await Users.update({_id:_id},{$set:{role:2,msg:'您的身份认证已经通过'}});
		ctx.body=0;
	}else{
		ctx.body='你没权限';
	}
})

router.get('/reviewRefuse', async (ctx, next) => {
	let loginbean = ctx.session.loginbean;
	if(loginbean&&loginbean.role==100){
		let id = ctx.query['id'];
		await ctx.render('admin/reviewRefuse', {id:id});
	}else{
		ctx.body='你没权限';
	}
})

router.post('/reviewRefuse', async (ctx, next) => {
	let loginbean = ctx.session.loginbean;
	if(loginbean&&loginbean.role==100){
		let id = ctx.request.body['id'];
		let msg = ctx.request.body['msg'];
		await Users.update({_id:id},{$set:{role:0,msg:'您的身份认证被驳回,原因:'+msg}});
		ctx.redirect('./identity');
	}else{
		ctx.body='你没权限';
	}
})

module.exports = router
