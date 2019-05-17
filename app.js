'use strict'
const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const router = require('./routes/config')
require("@babel/register");

// 跨域设置
app.use(cors({
  origin: ['http://localhost:8000'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

//connect-db
/**
 * mongoose连接数据库
 * @type {[type]}
 */
mongoose.Promise = require('bluebird');

const DB_URL = 'mongodb://localhost:27017/blog';
mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
});

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});
/**
 * 连接异常
 */
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

/**
 * 获取数据库表对应的js对象所在的路径
 * @type {[type]}
 */
const models_path = path.join(__dirname, './models')
/**
 * 用递归的形式，读取models文件夹下的js模型文件，并require
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
const walk = function (modelPath) {
  fs.readdirSync(modelPath).forEach(file => {
    let filePath = path.join(modelPath, '/' + file);
    let stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(filePath);
      }
    } else if (stat.isDirectory()) {
      walk(filePath);
    }
  })
}
walk(models_path);

module.exports = app;