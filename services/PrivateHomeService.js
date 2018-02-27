
let formidable = require('formidable');
let Users = require('../models/Users');
let  mongodb = require('mongodb');
class PrivateHomeService{
	constructor(){
    }
    
async authenticate(ctx){
	let loginbean = ctx.session.loginbean;
	if(!loginbean){
		ctx.body='登录过期,请重新登录';
		return;
	}
	  let form = new formidable.IncomingForm();   //创建上传表单
	  form.encoding = 'utf-8';        //设置编辑
	  form.uploadDir = './public/images/authenticate/';     //设置上传目录 文件会自动保存在这里
	  form.keepExtensions = true;     //保留后缀
	  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
	  let rs = await new Promise(function(resolve, reject) {
	  		form.parse(ctx.req,function(err, fields, files){
			  	if(err){
		            console.log(err);
		            reject('上传出错');
		            return;
		        }
		        // console.log(fields.realname);
		        // console.log(files.idcardface.path);
		        for(let key in files){
		        	if(files[key].size>0){
		        		let path = (files[key].path).replace('public','');
		        		fields[key]=path;
		        	}
		        }
		        resolve(fields);
		  	});
	  });
	  // console.log(rs);
	  
	  let _id = mongodb.ObjectID.createFromHexString((loginbean.id).toString());
	  rs['role']=1;
	  rs['msg']='您的认证正在审核中,请耐心等待';
	  await Users.update({_id:_id},{$set:rs});
	  loginbean.role=1;
	  loginbean.msg = rs['msg'];
	  ctx.session.loginbean = loginbean;
	  ctx.body=loginbean;
    }
}
exports.service = PrivateHomeService;