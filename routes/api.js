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

router.route('/user/userRegister').post(userCtrl.userRegister);
router.route('/user/login').post(userCtrl.login);
router.route('/user/forgotPassword').post(userCtrl.forgotPassword);
router.route('/user/deleteUser').delete(userCtrl.deleteUser);
router.route('/user/getUserById').post(userCtrl.getUserById);
router.route('/user/updatePassword').post(userCtrl.updatePassoword);
// router.route('/user/updateUserById').post(userCtrl.updateUserById);
router.route('/user/getAllUsers').post(userCtrl.getAllUsers);
 router.route('/expense/addExpense').post(expenseCtrl.addExpense);


module.exports = router;
