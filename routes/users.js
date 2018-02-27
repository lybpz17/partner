const router = require('koa-router')()

let Users = require('../models/Users')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.post('/register', async function (ctx, next) {
  // let email = ctx.request.body['email'];
  // let pwd = ctx.request.body['pwd'];
  // ctx.body = 'email:'+email+",pwd:"+pwd;
  
  
  delete ctx.request.body['repwd'];
  let users = new Users(ctx.request.body);
  try{
  	let rs = await users.save();
  	console.log(rs);
  	ctx.body = '插入成功';
  }catch(err){
  	let msg = err.message;
  	if(msg.indexOf('emailuiq')>0){
  		ctx.body = '账号重复';
  	}else if(msg.indexOf('nichenguiq')>0){
  		ctx.body = '昵称重复';
  	}else{
  		ctx.body = '数据库异常,稍后再试';
  	}
  }
  
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
