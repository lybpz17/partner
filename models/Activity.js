let mongoose = require('mongoose');

let Activity = mongoose.model('activitys', new mongoose.Schema({
      uid:mongoose.Schema.Types.ObjectId,
      nicheng:String,
      creditnum:Number,       //信用值
      atitle: String,
      atype:Number,
      adate:Number,           //结伴时间的时间戳
      address: String,
      lat:Number,             //纬度
      lng:Number,             //经度
      price:Number,
      limitnum:Number,    //人数限制
      otherinfo:String,
      updtime:{type:Date},
      createtime:{type:Date},
      signnum:{type:Number,default:1}     //报名人数
    },{_id:true}));

module.exports =  Activity;