let mongoose = require('mongoose');

let AdminUsers = mongoose.model('adminusers', new mongoose.Schema({  
      email: String,   
      pwd: String,
      nicheng:String,
    },{_id:true}));

module.exports =  AdminUsers;