let crypto = require('crypto');
let xmlreader = require("xmlreader"); 
let wechat = require('node-wechat');
// const wx = require('./wx')

class WxService{
	constructor(){
    }
    //总转发器
    async wxTransponder(ctx){
        if (!ctx.query['echostr']) {
            await this.responseMsg(ctx);  //用户发来消息从此入口
        }else{
            await this.valid(ctx);    //认证
        }
    }
    async valid(ctx){
        // if(ctx.query['echostr'])
        // {
            let echostr = ctx.query["echostr"];
            let signature = ctx.query["signature"];
            let timestamp = ctx.query["timestamp"];
            let nonce = ctx.query["nonce"];

            let token = 'hetao'; //令牌名
            /*  加密/校验流程如下： */
            //1. 将token、timestamp、nonce三个参数进行字典序排序
            let array = new Array(token,timestamp,nonce);
            array.sort();
            let str = array.toString().replace(/,/g,"");
            //2. 将三个参数字符串拼接成一个字符串进行sha1加密
            let sha1Code = crypto.createHash("sha1");
            let code = sha1Code.update(str,'utf-8').digest("hex");
            //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
                if(code===signature){
                        ctx.body=echostr;      //登陆成功
                }else{
                        ctx.body="error";
                }
        // }else{
        //     ctx.body='你无权限';
        // }
    }

    async responseMsg(ctx){
        if (ctx.method == 'POST' && ctx.is('text/xml')) {
            let promise = await new Promise(function (resolve, reject) {
                let buf = '';
                ctx.req.setEncoding('utf8');
                ctx.req.on('data', (chunk) => {
                    buf += chunk
                })
                ctx.req.on('end', () => {
                    console.log(buf);
                    console.log('-----------------------');
                    resolve(buf);
                })
            })
            console.log('aaaaaa');
            console.log(promise);
            // await promise.then((result) => {
            //         ctx.req.body = result
            //     })
            //     .catch((e) => {
            //         e.status = 400
            //     })

            // let msg = ctx.req.body ? ctx.req.body.xml : '';
            // console.log(msg);
            // if (!msg) {
            //     ctx.body = 'error request.';
            //     return;
            // }
            // MsgType = msg.MsgType[0];
            // console.log('MsgType:'+MsgType);
           let result = 'ok';

            ctx.res.setHeader('Content-Type', 'application/xml')
            ctx.res.end(result)

            // result = wx.message.text(msg, msg.Content)
            // await promise.then((result) => {
            //         ctx.req.body = result
            //     })
            //     .catch((e) => {
            //         e.status = 400
            //     })
        }
    }
}

exports.service = WxService;