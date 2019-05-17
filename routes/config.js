'use strict'
const router = require('koa-router')();
const { user, article } = require('../control');

router.prefix('/api');

//user
router.post('/user/register', user.register)
router.post('/user/login', user.login)
router.post('/user/getUserInfo', user.getUserInfo)
router.get('/user/logout', user.logout)

//article
router.get('/user/addArticle', article.addArticle)
router.get('/user/articleList', article.getArticleList)
router.get('/user/articleDetail', article.getArticleDetail)

module.exports = router;