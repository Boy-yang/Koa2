'use strict'
const xss = require('xss');
const uuid = require('uuid');
const User = require('../models/user.js');
const userHelp = require('../dbHelp/userHelp.js');
//注册逻辑处理
exports.register = async (ctx, next) => {
    const { username, phoneNumber, password } = ctx.request.body;
    let res = userHelp.findByUserName({ username });
    if (res) {
        ctx.body = {
            success: true,
            msg: '用户已存在'
        }
    }
    let user = new User({
        username,
        phoneNumber,
        password,
    });
    try {
        await user.save();
        ctx.body = {
            success: true,
            msg: '注册成功'
        }
    } catch (error) {
        ctx.body = {
            success: false,
            msg: '注册失败'
        }
        return next;
    }
}

//登陆验证处理
exports.login = async (ctx, next) => {
    const { username, password } = ctx.request.body;
    let res = userHelp.findByUserName({ username });
    if (!res) {
        ctx.body = {
            success: false,
            msg: '账号或密码错误'
        }
    } else {
        try {
            //保存登录状态，这句代码会在浏览器中生成一个cookie
            ctx.session.user = username;
            
            ctx.body = {
                success: true,
                msg: '登陆成功',
                username
            }
        } catch (error) {
            ctx.body = {
                success: false,
                msg: '登陆失败'
            }
            return next;
        }
    }
}


//获取用户信息
exports.getUserInfo = async (ctx, next) => {
    const { username } = ctx.request.body;
    let res = userHelp.findByUserName({ username });
    if(res){
        ctx.body = {
            userInfo: {
                username,
            }
        }
    }
    return next;
}
//退出登陆处理
exports.logout = async (ctx, next) => {
    // 将登录信息清空
    ctx.session = null;
    return next;
}

//获取文章信息
exports.article = async (ctx, next) => {
    ctx.body = [
        {
            "id": "001",
            "time": "10:30",
            "tChoose": "AM",
            "date": "2018/12/18",
            "title": "国学之旅",
            "content": "从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
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
            "content": "从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
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
            "content": "从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
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
            "content": "从硅谷地下车库的几行代码开始，一群程序员创立了声网 Agora，期待用实时音视频互动API改变全世界人们的沟通方式。\
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
// exports.signup = async (ctx, next) => {
//     let phoneNumber = xss(ctx.request.body.phoneNumber.trim())
//     let user = await User.findOne({
//         phoneNumber: phoneNumber
//     }).exec()

//     let verifyCode = Math.floor(Math.random() * 10000 + 1)

//     if (!user) {
//         let accessToken = uuid.v4()

//         user = new User({
//             nickname: '测试用户',
//             avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
//             phoneNumber: xss(phoneNumber),
//             verifyCode: verifyCode,
//             accessToken: accessToken
//         })
//     } else {
//         user.verifyCode = verifyCode
//     }
//     try {
//         user = await user.save()
//         ctx.body = {
//             success: true
//         }
//     } catch (e) {
//         ctx.body = {
//             success: false
//         }
//         return next
//     }
// }

// /**
//  * 更新用户信息操作
//  * @param  {[type]}   ctx  [description]
//  * @param  {Function} next [description]
//  * @return {[type]}        [description]
//  */
// exports.update = async (ctx, next) => {
//     let body = ctx.request.body
//     let user = ctx.session.user
//     let fields = 'avatar,gender,age,nickname,breed'.split(',')

//     fields.forEach(function (field) {
//         if (body[field]) {
//             user[field] = xss(body[field].trim())
//         }
//     })

//     user = await user.save()

//     ctx.body = {
//         success: true,
//         data: {
//             nickname: user.nickname,
//             accessToken: user.accessToken,
//             avatar: user.avatar,
//             age: user.age,
//             breed: user.breed,
//             gender: user.gender,
//             _id: user._id
//         }
//     }
// }



// /**
//  * 数据库接口测试
//  * @param  {[type]}   ctx  [description]
//  * @param  {Function} next [description]
//  * @return {[type]}        [description]
//  */
// exports.users = async (ctx, next) => {
//     let data = await userHelp.findAllUsers()
//     // let obj = await userHelp.findByPhoneNumber({phoneNumber : '13525584568'})
//     // console.log('obj=====================================>'+obj)

//     ctx.body = {
//         success: true,
//         data
//     }
// }
// exports.addUser = async (ctx, next) => {
//     let user = new User({
//         nickname: '测试用户',
//         avatar: 'http://ip.example.com/u/xxx.png',
//         phoneNumber: xss('13800138000'),
//         verifyCode: '5896',
//         accessToken: uuid.v4()
//     })
//     let user2 = await userHelp.addUser(user)
//     if (user2) {
//         ctx.body = {
//             success: true,
//             data: user2
//         }
//     }
// }
// exports.deleteUser = async (ctx, next) => {
//     const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
//     console.log(phoneNumber)
//     let data = await userHelp.deleteUser({
//         phoneNumber
//     })
//     ctx.body = {
//         success: true,
//         data
//     }
// }