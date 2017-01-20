var express = require('express');
var app = express();
var router = express.Router(); // get an instance of the router for api routes
const userCtrl = require('../controller/usersCtrl');
const auth = require('../helper/auth');


//---------------------------------------------------
    //User API
//---------------------------------------------------
router.route('/user/userRegister').post(userCtrl.userRegister);
router.route('/user/login').post(userCtrl.login);
router.route('/user/forgotPassword').post(userCtrl.forgotPassword);
router.route('/user/deleteUser').delete(auth.checkAuth,userCtrl.deleteUser);
router.route('/user/getUserById').post(auth.checkAuth, userCtrl.getUserById);
router.route('/user/updatePassword').post(auth.checkAuth, userCtrl.updatePassoword);
router.route('/user/getUsers').post(auth.checkAuth, userCtrl.getUsers);
router.route('/user/updateUserById').post(auth.checkAuth, userCtrl.updateUserById);
module.exports = router;
