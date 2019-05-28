'use strict'
const xss = require('xss');
const LeaveMsg = require('../models/leaveMsg.js');


//留言
exports.addLeaveMsg = async (ctx, next) => {
    const { author, content, avatar, atTime } = ctx.request.body;
    await new LeaveMsg({
        author,
        content,
        avatar,
        datetime: atTime
    })
        .save()
        .then(data => {
            if (!data) {
                ctx.body = {
                    success: true,
                    msg: '留言失败',
                }
            }

            try {
               
                ctx.body = {
                    success: true,
                    msg: '留言成功',
                    data
                
                    
                }
            } catch (error) {
                throw error;
            }
        })
    return next;
}

//获取留言列表
exports.getLeaveMsg= async (ctx, next) => {
    let list;
    const data = await LeaveMsg.find(null, '_id author avatar datetime content');
    try {
        ctx.body = {
            success: true,
            list: data || [],
        };
    } catch (error) {
        ctx.body = {
            success: false,
            error
        }
    }
    return next;
}


