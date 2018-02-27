let Activity = require('../models/Activity')
let Remark = require('../models/Remarks')
let JoinActive = require('../models/JoinActive')
let mongodb = require('mongodb')
Date.prototype.format = function(fmt) { 
         var o = { 
            "M+" : this.getMonth()+1,                 //月份 
            "d+" : this.getDate(),                    //日 
            "h+" : this.getHours(),                   //小时 
            "m+" : this.getMinutes(),                 //分 
            "s+" : this.getSeconds(),                 //秒 
            "q+" : Math.floor((this.getMonth()+3)/3), //季度 
            "S"  : this.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
         for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
        return fmt; 
    }
class ActivityService{
	constructor(){
    }
    async pubact(ctx){
        let loginbean = ctx.session.loginbean;
        if(!loginbean){
            ctx.body='登录过期,请重新登录';
            return;
        }
        if(loginbean.role==2){
            let form = ctx.request.body;
            // console.log(form);
            let obj = {'体育':0,'休闲娱乐':1,'户外':2,'其他':3};
            form['atype']=obj[form['atype']];
            let date = form['adate']+" "+form['atime'];
            date = Date.parse(date.replace(/-/g,"/"));
            date = new Date(date);
            form['adate']=date.getTime();
            form['uid']=mongodb.ObjectID.createFromHexString((loginbean.id).toString());
            form['nicheng']=loginbean.nicheng;
            form['creditnum']=loginbean.creditnum;
            let activity = new Activity(form);
            let rs = await activity.save();
            ctx.body='1';
        }else{
            ctx.body='无权发布，请审核信息后发布';
        }
        
    }
    async mypubmate(ctx){
        let loginbean = ctx.session.loginbean;
        if(!loginbean){
            ctx.body='登录过期,请重新登录';
            return;
        }
        if(loginbean.role==2){
            let uid = mongodb.ObjectID.createFromHexString((loginbean.id).toString());
            let rs = await Activity.find({uid:uid});
            ctx.body = rs;
        }else{
            ctx.body='无权发布，请审核信息后发布';
        }
    }
    async getMates(ctx){
        let lng = ctx.query['lng'];
        let lat = ctx.query['lat'];
        let lngLeft = lng-0.06;
        let lngRight = lng+0.06;
        let latTop = lat+0.03;
        let latBottom = lat-0.03;
        //获取当前一天的时间戳
        let date = new Date();
        date.setDate(date.getDate()-1);
        let datetime = date.getTime();
        let rs = await Activity.find({"lng":{$lt:lngRight},"lng":{$gt:lngLeft},"lat":{$lt:latTop},"lat":{$gt:latBottom},"adate":{$gt:datetime}});
        ctx.body=rs;
    }
    async getMatesWx(ctx){
        let lngLeft = ctx.query['lngLeft'];
        let lngRight = ctx.query['lngRight'];
        let latTop = ctx.query['latTop'];
        let latBottom = ctx.query['latBottom'];
        //获取当前一天的时间戳
        let date = new Date();
        date.setDate(date.getDate()-1);
        let datetime = date.getTime();
        let rs = await Activity.find({"lng":{$lt:lngRight},"lng":{$gt:lngLeft},"lat":{$lt:latTop},"lat":{$gt:latBottom},"adate":{$gt:datetime}});
        ctx.body=rs;
    }
    async getMateInfo(ctx){
        let id = ctx.query['id'];
        let rs = await Activity.findOne({_id:id});
        let date = (new Date(rs.adate)).format("yyyy年MM月dd日 hh:mm");

        let joinActiveRs = await JoinActive.find({aid:id});
        
        let puberid = rs.uid.toString();
        let loginbean = ctx.session.loginbean;
        let ispuber=0;
        if(typeof(loginbean)!='undefined'&&loginbean!=null){
            if(puberid==loginbean.id){
                ispuber=1;
            }
        }
        //共计多少条评论
        let page = 1;
        let pageShow = 3;       //每页显示条数
        if(typeof(ctx.query['page'])!='undefined'){
            page = parseInt(ctx.query['page']);
        }
        if(page<0){page=1;}
        //查询身份认证列表
        //第一页评论
        let remarkCount = await Remark.count({aid:id});
        let pagesum = Math.ceil(remarkCount/pageShow);
        if(pagesum>0&&page>pagesum){page=pagesum;}
        let point = (page-1)*pageShow;
        let remarkRs = await Remark.find({aid:id}).sort({"createtime":-1}).skip(point).limit(pageShow);
        // arr.push(remarkCount);
        // arr.push(remarkRs);
        let arr = [rs,date,remarkCount,remarkRs,joinActiveRs,ispuber];
        ctx.body=arr;
    }

    async pubremark(ctx){
        let loginbean = ctx.session.loginbean;
        if(!loginbean){
            ctx.body='登录过期,请重新登录';
            return;
        }
        let whovisible = ctx.request.body['whovisible'];
        let obj = {'全部可见':0,'仅发布者可见':1};
        let aid = ctx.request.body.aid;
        aid = mongodb.ObjectID.createFromHexString(aid.toString());
        ctx.request.body.whovisible = obj[whovisible];
        ctx.request.body.uid = loginbean['id'];
        ctx.request.body.nicheng = loginbean['nicheng'];
        ctx.request.body.creditnum = loginbean['creditnum'];
        ctx.request.body.createtime = (new Date()).getTime();

        let remark = new Remark(ctx.request.body);
        let rs = await remark.save();
        ctx.body = 0;   //回复成功
    }

    async joinactive(ctx){
        let loginbean = ctx.session.loginbean;
        if(!loginbean){
            ctx.body='登录过期,请重新登录';
            return;
        }
        let tel = ctx.request.body['tel'];
        ctx.body=tel;
        
        let aid = ctx.request.body.aid;
        aid = mongodb.ObjectID.createFromHexString(aid.toString());
        ctx.request.body['aid']=aid;
        ctx.request.body['nicheng']=loginbean.nicheng;
        ctx.request.body['creditnum']=loginbean.creditnum;
        ctx.request.body.createtime = (new Date()).getTime();
        let joinActive = new JoinActive(ctx.request.body);
        let rs = await joinActive.save();
        ctx.body='1';
    }
}

exports.service = ActivityService;