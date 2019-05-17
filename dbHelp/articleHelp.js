'use strict'

const mongoose = require('mongoose')
const Article = mongoose.model('Article')

/**
 * 通过文章id查找
 * @param  {[type]} options.phoneNumber [description]
 * @return {[type]}                     [description]
 */
exports.findByArticleId = async ({articleId}) => {
    let res = null;
    let article=await Article.findOne({
        articleId
    }).exec();
    if(article) res=article;
    return res;
}