const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var cors = require('koa-cors');
let mongoose = require('mongoose');
var session = require('koa-generic-session');

const index = require('./routes/index')
const users = require('./routes/users')
const restful = require('./routes/restful')
const admin = require('./routes/admin')
const wxapi = require('./routes/wxapi')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(cors());

app.keys = ['my secret key'];
app.use(session());

var conn = mongoose.connect('mongodb://localhost/partner');

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(restful.routes(), restful.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())
app.use(wxapi.routes(), wxapi.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
