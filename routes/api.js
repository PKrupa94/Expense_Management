var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
var userCtrl = require('../controller/usersCtrl');

//---------------------------------------------------
    //User API
//---------------------------------------------------
console.log(userCtrl);
router.route('/user/userRegister').post(userCtrl.userRegister);
router.route('/user/login').post(userCtrl.login);
router.route('/user/forgotPassword').post(userCtrl.forgotPassword);


module.exports = router;
