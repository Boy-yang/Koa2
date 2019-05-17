'use strict'
const xss = require('xss');
const User = require('../models/user.js');
const userHelp = require('../dbHelp/userHelp.js');
//注册逻辑处理
exports.register = async (ctx, next) => {
    const { username, phoneNumber, password } = ctx.request.body;
    let res = await userHelp.findByUserName({ username });
    if (!res) {
        let user = new User({
            username,
            phoneNumber,
            password,
        });
        await user.save();
        ctx.body = {
            success: true,
            msg: '注册成功',
        };
        return next;   
    }
    ctx.body = {
        success: true,
        msg: '用户已存在',
    }
}


//登陆验证处理
exports.login = async (ctx, next) => {
    const { username } = ctx.request.body;
    let res = await userHelp.findByUserName({ username });
    if(!res){
        ctx.body = {
            success: false,
            msg: '用户名或密码错误',
        };
    }
    //保存登录状态，这句代码会在浏览器中生成一个cookie
    ctx.session.userInfo = res;
    ctx.body = {
        success: true,
        msg: '登陆成功',
    };
    return next;
}

//用户验证
exports.getUserInfo = async (ctx, next) => {
    if (ctx.session.userInfo) {
        ctx.body = {
            success: true,
            msg: '已登陆状态',
            data:ctx.session.userInfo
        }
    } else {
        ctx.body = {
            success: false,
            msg: '请重新登陆',
            data: ctx.session.userInfo
        }
    }
    return next;
}
//退出登陆处理
exports.logout = async (ctx, next) => {
    // 清空session
    ctx.session = null;
    try {
        ctx.body={
            success:true,
            msg:'退出登陆成功'
        }  
    } catch (error) {
        ctx.body={
            success:false,
            err
        }
    }
    return next;
}