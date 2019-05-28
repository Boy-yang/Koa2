'use strict'
const xss = require('xss');
const Article = require('../models/article.js');
const articleHelp = require('../dbHelp/articleHelp.js');

//添加文章
exports.addArticle = async (ctx, next) => {
    const { title, content, atTime, isPublish } = ctx.request.body;
    const author = ctx.session.userInfo.username;
    await new Article({
        title,
        content,
        author,
        time: atTime,
        isPublish
    })
        .save()
        .then(data => {
            if (!data) {
                ctx.body = {
                    success: false,
                    msg: '文章发布失败',
                    data
                }
            }
            try {
                ctx.body = {
                    success: true,
                    msg: '文章发布成功',
                    data
                }
            } catch (error) {
                throw error;
            }
        })
    return next;
}

//更新文章
exports.updateArticle = async (ctx, next) => {
    const { title, content, time, isPublish, _id } = ctx.request.body;
    const res = await Article.update({ _id }, { title, content, time, isPublish });
    if (!res) {
        ctx.body = {
            success: false,
            msg: '更新失败',
            res,
        }
    }
    try {
        ctx.body = {
            success: true,
            msg: '更新成功',
            res,
        }
    } catch (error) {
        throw error;
    }
    return next;
}

//删除文章
exports.delArticle = async (ctx, next) => {
    const { _id } = ctx.query;
    const res = await Article.deleteOne({ _id });
    if (res.n !== 1) {
        ctx.body = {
            success: false,
            msg: '删除失败'
        }
    }
    try {
        ctx.body = {
            success: true,
            msg: '删除成功'
        }

    } catch (error) {
        throw error;
    }
    return next;
}

//获取文章列表
exports.getArticleList = async (ctx, next) => {
    let { isPublish, start, limit } = ctx.query;
    start = Number(start);
    limit = Number(limit);
    let skip = (start - 1) < 0 ? 0 : (start - 1) * 5;
    const total = await Article.count({ isPublish });
    const data = await Article.find(null, '_id title author time content isPublish', {
        skip: skip,
        limit,
    });
    try {
        ctx.body = {
            success: true,
            total,
            list: data || []
        };

    } catch (error) {
        ctx.body = {
            success: false,
            error
        }
    }
    return next;
}

//获取文章详情
exports.getArticleDetail = async (ctx, next) => {
    const { _id } = ctx.query;
    let res = await Article.findOne({ _id });
    if (!res) {
        ctx.body = {
            msg: '文章不存在'
        }
    }
    try {
        ctx.body = {
            success: true,
            data: res,
        }
    } catch (error) {
        throw error;
    }

    return next;
}

//查询文章
exports.searchArticle = async (ctx, next) => {
    const { title } = ctx.query;
    ctx.body={
        success:true,
        msg:'查询成功'
    }
    // let res = await Article.findOne({ _id });
    // if (!res) {
    //     ctx.body = {
    //         msg: '文章不存在'
    //     }
    // }
    // try {
    //     ctx.body = {
    //         success: true,
    //         data: res,
    //     }
    // } catch (error) {
    //     throw error;
    // }

    return next;
}

