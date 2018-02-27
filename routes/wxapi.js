const router = require('koa-router')()
let crypto = require('crypto');
const xml2js = require('xml2js')

router.prefix('/wxapi')

function xmlToJson (str) {
    return new Promise((resolve, reject) => {
        const parseString = xml2js.parseString
        parseString(str, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function jsonToXml (obj) {
    const builder = new xml2js.Builder()
    return builder.buildObject(obj)
}

router.all('/', async (ctx, next) => {
    if(ctx.method=='GET'){
        let echostr = ctx.query["echostr"];
        let signature = ctx.query["signature"];
        let timestamp = ctx.query["timestamp"];
        let nonce = ctx.query["nonce"];

        let token = 'liyang'; //令牌名
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
    }else{
        if(ctx.is('text/xml')){
          let msgJson = await new Promise(function (resolve, reject) {
                let buf = ''
                ctx.req.setEncoding('utf8')
                ctx.req.on('data', (chunk) => {
                    buf += chunk
                })
                ctx.req.on('end',async () => {
                    let json = await xmlToJson(buf);
                    resolve(json);
                })
            });
          console.log(msgJson);
          let myMsg = msgJson;
          let FromUserName = msgJson.xml['ToUserName'];
          let ToUserName = msgJson.xml['FromUserName'];
          myMsg.xml['FromUserName'] = FromUserName;
          myMsg.xml['ToUserName'] = ToUserName;
          myMsg.xml['MsgType'] = 'text';
          myMsg.xml['CreateTime'] = [new Date()];
          delete myMsg.xml['MsgId'];
          if(!(typeof(msgJson.xml['Event'])!='undefined'&&msgJson.xml['Event']=='subscribe')){
             myMsg.xml['Content'] = ['裘文硕你好'];
          }else{
             myMsg.xml['Content'] = ['欢迎来到结伴空间'];
          }
          
          let result = jsonToXml(myMsg);
          ctx.body = result;
          }

    }
})


module.exports = router
