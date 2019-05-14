'use strict'
const router = require( 'koa-router' )();
const {user,app} = require( '../control' );

router.prefix( '/api' );



//register
router.post( '/user/register',user.register)

//login
router.post( '/user/login',user.login)

//getUserInfo
router.post( '/user/getUserInfo',user.getUserInfo)

//logout
router.get('/user/logout',user.logout)

//article
router.get( '/user/article',user.article)

// // user
// router.post( '/u/signup', App.hasBody, User.signup )
// router.post( '/u/update', App.hasBody, App.hasToken, User.update )

// // DB Interface test
// router.get( '/test/user/users', User.users )
// router.post( '/test/user/add', User.addUser )
// router.post( '/test/user/delete', User.deleteUser )

module.exports = router;