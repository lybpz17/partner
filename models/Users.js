let mongoose = require('mongoose');

let Users = mongoose.model('users', new mongoose.Schema({  
      email: String,   
      pwd: String,
      nicheng:String,
      role:{type:Number,default:0},		//角色0表刚注册,1表认证申请中,2表通过,-1表驳回
      creditnum:{type:Number,default:0},//信用积分
      praise:{type:Number,default:0},	//结伴好评度
      updtime:{type:Date,default:Date.now},
      createtime:{type:Date},
      realname:String,
      sex:Number,
      telphone:String,
      idcardnum:String,
      idcardface:String,
      idcardback:String,
      idcardme:String,
      msg:String,
    },{_id:true}));

module.exports =  Users;