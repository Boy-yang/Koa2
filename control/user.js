'use strict'
const xss = require('xss')
const uuid = require('uuid')
const User = require('../models/user.js');
const userHelp = require('../dbHelp/userHelp.js');

//注册逻辑处理
exports.register = async (ctx, next) => {
    const { phoneNumber, password } = ctx.request.body;
    await User.findOne({
        phoneNumber: phoneNumber
    })
        .then(res => {
            if (res) {
                ctx.body = {
                    code: 2,
                    msg: '用户已存在'
                };
            } else {
                //用户不存在，则将前端传来的用户信息存库
                const user = new User({
                    phoneNumber: phoneNumber,
                    password: password,
                });
                return user.save()   //存库之后返回promise结果   
            }
        })
        .then(res => {
            if (res) {//如果res存在，说明保存成功，即注册成功
                ctx.body = {
                    code: 1,
                    msg: '注册成功'
                };
            }
        })
        .catch(e => {//存库失败，响应注册失败
            if (e) {
                ctx.body = {
                    code: 3,
                    msg: '注册失败'
                };
                return next;
            }
        })
};

//登陆验证处理
exports.login = async (ctx, next) => {
    const { phoneNumber, password } = ctx.request.body;
    await User.findOne({
        phoneNumber: phoneNumber
    })
        .then(res => {
            if (!res) {
                ctx.body = {
                    code: 2,
                    msg: '不存在该用户'
                }
                return;
            }
            if (res.password === password) {
                ctx.body = {
                    code: 1,
                    msg: '登陆成功',
                    phoneNumber,
                }
            } else {
                ctx.body = {
                    code: 3,
                    msg: '密码错误'
                }
            }
        })
        .catch(e => {//存库失败，响应注册失败
            if (e) {
                ctx.body = {
                    code: 4,
                    msg: '登陆失败',
                }
                return next;
            }
        })
};

   
exports.article = async (ctx, next) => {
    ctx.body = [
        {
            "id": "001",
            "time": "10:30",
            "tChoose": "AM",
            "date": "2018/12/18",
            "title": "国学之旅",
            "content":"从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
            我们在全球搭建了专为实时传输而生的软件定义实时网 SD-RTN™ ，我们设计了简单易用的实时通信API，\
            我们为全球开发者提供每月超过100亿分钟的实时音视频技术服务。\
            迄今为止，我们在全球200多个国家和地区拥有超过2亿的SDK安装量。"
        },
        {
            "id": "002",
            "time": "11:30",
            "tChoose": "AM",
            "date": "2019/1/18",
            "title": "javascript",
            "content":"从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
            我们在全球搭建了专为实时传输而生的软件定义实时网 SD-RTN™ ，我们设计了简单易用的实时通信API，\
            我们为全球开发者提供每月超过100亿分钟的实时音视频技术服务。\
            迄今为止，我们在全球200多个国家和地区拥有超过2亿的SDK安装量。"
        },
        {
            "id": "003",
            "time": "6:30",
            "tChoose": "PM",
            "date": "2019/2/18",
            "title": "国学之旅",
            "content":"从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
            我们在全球搭建了专为实时传输而生的软件定义实时网 SD-RTN™ ，我们设计了简单易用的实时通信API，\
            我们为全球开发者提供每月超过100亿分钟的实时音视频技术服务。\
            迄今为止，我们在全球200多个国家和地区拥有超过2亿的SDK安装量。"
        },
        {
            "id": "004",
            "time": "1:30",
            "tChoose": "PM",
            "date": "2019/3/18",
            "title": "国学之旅",
            "content":"从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
            我们在全球搭建了专为实时传输而生的软件定义实时网 SD-RTN™ ，我们设计了简单易用的实时通信API，\
            我们为全球开发者提供每月超过100亿分钟的实时音视频技术服务。\
            迄今为止，我们在全球200多个国家和地区拥有超过2亿的SDK安装量。"
        },
    ]
}

/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
    let phoneNumber = xss(ctx.request.body.phoneNumber.trim())
    let user = await User.findOne({
        phoneNumber: phoneNumber
    }).exec()
    console.log(user)

    let verifyCode = Math.floor(Math.random() * 10000 + 1)
    console.log(phoneNumber)
    if (!user) {
        let accessToken = uuid.v4()

        user = new User({
            nickname: '测试用户',
            avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
            phoneNumber: xss(phoneNumber),
            verifyCode: verifyCode,
            accessToken: accessToken
        })
    } else {
        user.verifyCode = verifyCode
    }
    try {
        user = await user.save()
        ctx.body = {
            success: true
        }
    } catch (e) {
        ctx.body = {
            success: false
        }
        return next
    }
}

/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.update = async (ctx, next) => {
    let body = ctx.request.body
    let user = ctx.session.user
    let fields = 'avatar,gender,age,nickname,breed'.split(',')

    fields.forEach(function (field) {
        if (body[field]) {
            user[field] = xss(body[field].trim())
        }
    })

    user = await user.save()

    ctx.body = {
        success: true,
        data: {
            nickname: user.nickname,
            accessToken: user.accessToken,
            avatar: user.avatar,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            _id: user._id
        }
    }
}



/**
 * 数据库接口测试
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.users = async (ctx, next) => {
    let data = await userHelp.findAllUsers()
    // let obj = await userHelp.findByPhoneNumber({phoneNumber : '13525584568'})
    // console.log('obj=====================================>'+obj)

    ctx.body = {
        success: true,
        data
    }
}
exports.addUser = async (ctx, next) => {
    let user = new User({
        nickname: '测试用户',
        avatar: 'http://ip.example.com/u/xxx.png',
        phoneNumber: xss('13800138000'),
        verifyCode: '5896',
        accessToken: uuid.v4()
    })
    let user2 = await userHelp.addUser(user)
    if (user2) {
        ctx.body = {
            success: true,
            data: user2
        }
    }
}
exports.deleteUser = async (ctx, next) => {
    const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
    console.log(phoneNumber)
    let data = await userHelp.deleteUser({
        phoneNumber
    })
    ctx.body = {
        success: true,
        data
    }
}