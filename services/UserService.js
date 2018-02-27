let Users = require('../models/Users')
class UserService{
	constructor(){
    }
    async login(ctx){
    	// delete ctx.request.body['yzm'];
    	let email = ctx.request.body['email'];
    	let pwd = ctx.request.body['pwd'];
    	let rs = await Users.findOne({email:email,pwd:pwd});
    	if(rs!=null){
    		let user = {
    			id:rs['_id'],
    			nicheng:rs.nicheng,
    			role:rs['role'],
                creditnum:rs['creditnum'],
                msg:rs['msg'],
    		}
            // if(typeof(rs['msg'])=='undefined'){
            //     user['msg']='';
            // }else{
            //     user['msg']=rs['msg'];
            // }
            // console.log(user.msg);
    		ctx.session.loginbean = user;
    		ctx.body=user;
    	}else{
    		ctx.body = null;
    	}
    	
    }
    async register(ctx){
      delete ctx.request.body['repwd'];
      ctx.request.body['createtime']=new Date();
      ctx.request.body['msg']='您还没有身份认证,不能发起结伴,请认证';
	  let users = new Users(ctx.request.body);
	  try{
	  	let rs = await users.save();
	  	ctx.body = '插入成功';
	  }catch(err){
	  	let msg = err.toString();
	  	if(msg.indexOf('emailuiq')>0){
	  		ctx.body = '账号重复';
	  	}else if(msg.indexOf('nichenguiq')>0){
	  		ctx.body = '昵称重复';
	  	}else{
	  		ctx.body = '数据库异常,稍后再试';
	  	}
	  }
    }
    async getSession(ctx){
    	ctx.body = ctx.session.loginbean;
    }

    async logout(ctx){
    	delete ctx.session.loginbean;
    	ctx.body=1;
    }
}

exports.service = UserService;