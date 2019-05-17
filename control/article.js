'use strict'
const xss = require('xss');
const Article = require('../models/article.js');
const articleHelp = require('../dbHelp/articleHelp.js');

//添加文章
exports.addArticle = async (ctx, next) => {
    const { title, content, atTime, isPublish } = ctx.query;
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
            ctx.body = {
                success: true,
                msg: '文章发布成功',
                data
            }
        })
    return next;
}


//更新文章
exports.updateArticle = async (ctx, next) => {
    const { title, content, time, tags, isPublish, id } = ctx.request.body;
    Article.update({ _id: id }, { title, content, time, tags: tags.split(','), isPublish })
        .then(res => {
            console.log(res);
            ctx.body = {
                success: true,
                msg: '更新成功',
                res
            }
        }).cancel(err => {
            console.log(err);
            ctx.body = {
                success: false,
                err
            }
        })
    return next;
}

//删除文章
exports.delArticle = async (ctx, next) => {
    let id = ctx.query.id;
    Article.remove({ _id: id })
        .then(res => {
            if (res.result.n === 1) {
                ctx.body = {
                    success: true,
                    msg: '删除成功'
                }
            } else {
                ctx.body = {
                    success: true,
                    msg: '文章不存在'
                }
            }
        }).cancel(err => {
            console.log(err);
            ctx.body = {
                success: false,
                err
            }
        })
    return next;
}

//获取文章列表
exports.getArticleList = async (ctx, next) => {
    let { isPublish,start,limit } = ctx.query;
    start=Number(start);
    limit=Number(limit);
    console.log(typeof start, typeof limit)
    let skip = (start - 1) < 0 ? 0 : (start - 1) * 5;
    let responseData = {
        total: 0,
        list: []
    };
    // const count = Article.count({isPublish});
    // responseData.total=count;
    
    const data = await Article.find(null, '_id title author time content isPublish',{
        skip:skip,
        limit,
    });
    try {
        responseData.list=data;
        ctx.body={
            success:true,
            responseData
        };
        
    } catch (error) {
        ctx.body={
            success:false,
            error
        } 
    }

    // let tag = ctx.query.tag || null;
    // let isPublish = ctx.query.isPublish;
    // let searchCondition = {
    //     isPublish,
    // };
    // if (tag) {
    //     searchCondition.tags = tag;
    // }
    // if (isPublish === 'false') {
    //     searchCondition = null
    // }
    // let skip = (ctx.query.pageNum - 1) < 0 ? 0 : (ctx.query.pageNum - 1) * 5;
    // let responseData = {
    //     total: 0,
    //     list: []
    // };
    // Article.count(searchCondition)
    //     .then(count => {
    //         responseData.total = count;
    //         Article.find(searchCondition, '_id title isPublish author viewCount commentCount time coverImg', {
    //             skip: skip,
    //             limit: 5
    //         })
    //             .then(res => {
    //                 responseData.list = res;
    //                 ctx.body = {
    //                     success: true,
    //                     responseData
    //                 }
    //             }).cancel(err => {
    //                 throw err
    //             })
    //     }).cancel(err => {
    //         ctx.body = {
    //             success: false,
    //             err
    //         }
    //     });
    return next;
}

//获取文章详情
exports.getArticleDetail = async (ctx, next) => {
    const { articleId } = ctx.query.articleId;
    let res = await Article.findOne({ articleId });
    if (!res) {
        ctx.body = {
            msg: '文章不存在'
        }
    }
    // await Article.findOne({ _id })
    //     .then(data => {
    //         data.viewCount = data.viewCount + 1;
    //         Article.update({ _id }, { viewCount: data.viewCount })
    //             .then(res => {
    //                 ctx.body = {
    //                     success: true,
    //                     res,
    //                     data
    //                 }
    //             })
    //             .cancel(err => {
    //                 throw err;
    //             })
    //     })
    //     .cancel(err => {
    //         ctx.body = {
    //             success: false,
    //             err
    //         }
    //     })
    return next;
}