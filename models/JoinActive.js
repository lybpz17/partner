let mongoose = require('mongoose');

let JoinActive = mongoose.model('joinactives', new mongoose.Schema({
      uid:mongoose.Schema.Types.ObjectId,
      aid:mongoose.Schema.Types.ObjectId,
      nicheng:String,         //参加者昵称
      creditnum:Number,       //参加者信用值
   	tel:Number,             //手机号
      weixin:String,
      qq:Number,
      remarks:String,         //备注
      createtime:Number, //报名时间
      },{_id:true}));

module.exports =  JoinActive;
