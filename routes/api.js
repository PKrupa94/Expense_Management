var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
const userCtrl = require('../controller/usersCtrl');
const expenseCtrl = require('../controller/expenseCtrl');
const auth = require('../middleware/auth');


//---------------------------------------------------
    //User API
//---------------------------------------------------

router.use(function(req,res,next){
    console.log(req.url)
    var byPassUrl = ["/user/userRegister","/user/login","/user/forgotPassword"]
    if(byPassUrl.indexOf(req.url,byPassUrl) > -1){
        next()
    }else{
        auth.checkAuth(req,res,next)
    }
});


/**
 * @api {post} /user/userRegister
 * @apiName userRegister
 * @apiGroup user
 *
 * @apiParam {String} email user email 
 * @apiParam {String} passsword user password 
 * @apiParam {String} name user name
 * @apiParam {String} mobileNo user mobileNo
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "User successfully created",
 * "userData": {
 *   "_id": "5882f8ccb539130a838e34ac",
 *   "email": "test@ex.com",
 *   "password": "$2a$05$uEp4if6TCpyLtMfaXNdNpeCIgeE9u29Dr7BUBSSR6RTJvWW7LYF1q",
 *   "secret_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RncmF2dUBnbWFpbC5jb20iLCJpYXQiOjE0ODQ5NzgzODB9.k3duaX3xxNe0GHSM63xb5gUjG_9kZRGYbHIHKjaJWXM",
 *   "__v": 0,
 *   "balance": 0,
 *   "isAdmin": false
 * }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: email
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid email"
 * }
 * 
 * 
 * @apiErrorExample 400 Error: password
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid password"
 * }
 * 
 * * @apiErrorExample 400 Error: mobileNo
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid mobile number"
 * }
 * 
 * @apiErrorExample 400 Error: name
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter your name"
 * }
 * 
 * 
 * 
 */

router.route('/user/userRegister').post(userCtrl.userRegister);

/**
 * @api {post} /user/login
 * @apiName login
 * @apiGroup user
 *
 * @apiParam {String} email user email used at registration
 * @apiParam {String} passsword user password 
 *
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "You are successfully login",
 * "user": {
 *   "_id": "5882f8ccb539130a838e34ac",
 *   "email": "test@ex.com",
 *   "password": "$2a$05$uEp4if6TCpyLtMfaXNdNpeCIgeE9u29Dr7BUBSSR6RTJvWW7LYF1q",
 *   "secret_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RncmF2dUBnbWFpbC5jb20iLCJpYXQiOjE0ODQ5NzgzODB9.k3duaX3xxNe0GHSM63xb5gUjG_9kZRGYbHIHKjaJWXM",
 *   "__v": 0,
 *   "balance": 0,
 *   "isAdmin": false
 * },
 * "secret_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ODJmOGNjYjUzOTEzMGE4MzhlMzRhYyIsImlhdCI6MTQ4NDk3ODcyN30.J9nVvpACQAkxrrOc5LVzyRtScLdi8dbRrKIBR7OABg0"
 *  }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: email
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid email"
 * }
 * 
 * 
 * @apiErrorExample 400 Error: password
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid password"
 * }
 */


router.route('/user/login').post(userCtrl.login);

/**
 * @api {post} /user/forgotPassword
 * @apiName forgotPassword
 * @apiGroup user
 *
 * @apiParam {String} email user email used at registration
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "Password sent to your email address"
 *  }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: email
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter valid email"
 * }
 * 
 * 
 */

router.route('/user/forgotPassword').post(userCtrl.forgotPassword);

/**
 * @api {post} /user/deleteUser
 * @apiName deleteUser
 * @apiGroup user
 *
 * @apiParam {String} id user id
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "User is successfully deleted"
 *  }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: id
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Sorry!!,User is not found for this Id"
 * }
 * 
 * 
 */

router.route('/user/deleteUser').delete(userCtrl.deleteUser);

/**
 * @api {post} /user/getUserById
 * @apiName getUserById
 * @apiGroup user
 *
 * @apiParam {String} userId user id 
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "successfully fetch userInfo",
 * "userData": {
 *   "_id": "5882f8ccb539130a838e34ac",
 *   "email": "test@ex.com",
 *   "password": "$2a$05$uEp4if6TCpyLtMfaXNdNpeCIgeE9u29Dr7BUBSSR6RTJvWW7LYF1q",
 *   "secret_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RncmF2dUBnbWFpbC5jb20iLCJpYXQiOjE0ODQ5NzgzODB9.k3duaX3xxNe0GHSM63xb5gUjG_9kZRGYbHIHKjaJWXM",
 *   "__v": 0,
 *   "balance": 50,
 *   "isAdmin": false
 * }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: userId
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Sorry!!,User is not found for this Id"
 * }
 * 
 */

router.route('/user/getUserById').post(userCtrl.getUserById);

/**
 * @api {post} /user/updatePassoword
 * @apiName updatePassoword
 * @apiGroup user
 *
 * @apiParam {String} password user old password
 * @apiParam {String} newPassword user new password
 * @apiSuccess {String} Success status with user object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "Your password is successfully Updated"
 *  }
 *
 * @apiError 4xx status with some error message
 *
 * @apiErrorExample 400 Error: password
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter yourcurrent password"
 * }
 * 
 * 
 * @apiErrorExample 400 Error: newPassword
 *     HTTP/1.1 404 Not Found
 * {
 *  "success": false,
 *  "message": "Please enter your new password"
 * }
 */

router.route('/user/updatePassword').post(userCtrl.updatePassoword);
router.route('/user/getUsers').post(userCtrl.getUsers);

router.route('/expense/addExpense').post(expenseCtrl.addExpense);

module.exports = router;
