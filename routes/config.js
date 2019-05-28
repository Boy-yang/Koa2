'use strict'
const router = require('koa-router')();
const { user, article,leaveMsg } = require('../control');

router.prefix('/api');

//user
router.post('/user/register', user.register)
router.post('/user/login', user.login)
router.post('/user/getUserInfo', user.getUserInfo)
router.get('/user/logout', user.logout)

//article
router.post('/user/addArticle', article.addArticle)
router.get('/user/delArticle', article.delArticle)
router.get('/user/updateArticle', article.updateArticle)
router.get('/user/articleList', article.getArticleList)
router.get('/user/articleDetail', article.getArticleDetail)

//leaveMsg
router.post('/user/addLeaveMsg', leaveMsg.addLeaveMsg)
router.get('/user/getLeaveMsg', leaveMsg.getLeaveMsg)

module.exports = router;