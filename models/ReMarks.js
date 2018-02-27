let mongoose = require('mongoose');

let ReMark = mongoose.model('remarks', new mongoose.Schema({
      aid:mongoose.Schema.Types.ObjectId,
      creditnum:Number,       //信用值
      uid:mongoose.Schema.Types.ObjectId,
      nicheng:String,
      content:String,
      whovisible:Number,      //0表全可见,1表仅发布者可见
      createtime:Number
    },{_id:true}));

module.exports =  ReMark;