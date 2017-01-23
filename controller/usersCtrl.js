const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Load the bcrypt module
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const config = require('../config'); //get config file
const validate = require('../helper/validation'); //get validation file
const message = require('../helper/messages'); //get alertMessages file
const saltRounds = 5; 

//-----------------------------------------
    //POST : /user/login
    //User Login
//-----------------------------------------

exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    //validation for email and password
    if(!validate.isEmail(email) || validate.isEmpty(email)){
         res.status(400).json({success:false,message:message.invalidEmail})
    }else if(validate.isEmpty(password)){
        res.status(400).json({success:false,message:message.emptyPass})
    }

    User.find({email : email},function(err,users){
        console.log('===============================>',users);
        if(err) res.json({success:false,message:message.loginFail});
        if (users.length > 0){
              if (bcrypt.compareSync(password, users[0].password)) {
                var token = jwt.sign({id:users[0].id},config.secret);
                res.json({ success: true, message: message.successLogin, user: users[0],secret_token:token});
            } else {
                res.status(400).json({ success: false, message: message.errorLogin});
            }
        }else{
            res.json({success:false,message:message.userNotFound});
        }
    });
};


//-----------------------------------------
    //POST : /user/userRegister
    //User registration
//-----------------------------------------

exports.userRegister = function(req,res){
   
   var email = req.body.email;
   var salt = bcrypt.genSaltSync(saltRounds); //generate salt
   var encryptPass = bcrypt.hashSync(req.body.password,salt); // Hash the password with the salt
   var name = req.body.name;
   var mobileNo = req.body.mobileNo;
   var password = encryptPass;
   var admin = req.body.isAdmin ;

   //validate fields
    if(!validate.isEmail(email) || validate.isEmpty(email)){
        res.status(400).json({success:false,message:message.invalidEmail});
    }else if(validate.isEmpty(req.body.password)){
        res.status(400).json({success:false,message:message.emptyPass});
    }else if(validate.isEmpty(name)){
         res.status(400).json({success:false,message:message.emptyName});
    }else if(validate.isEmpty(mobileNo) || !validate.isValidMobileNo(mobileNo)){
         res.status(400).json({success:false,message:message.emptyMobileNo})
    }

   User.find({email:email},function(err,users){
        if(err) res.json({success:false,message:message.networkErr});

        if(users.length > 0){
            res.json({success:false,messgae:message.alreadyRegisterUser});
        }else{
            var userData = new User({
            name : name,
            email : email,
            password : password,
            mobileNo : mobileNo,
            isAdmin : admin,
            secret_token : jwt.sign({id:email},config.secret)
        });
        //save data into database
        userData.save(function(err,userValue){
            if(err) res.json({success:false,message:message.registrationFailed}); 
            res.status(200).json({success:true,message:message.successRegister,userData:userValue});
           });
        }     
   });
};

//-----------------------------------------
    //POST : /user/forgotPassword
    //User forgotPassword
//-----------------------------------------

exports.forgotPassword = function(req,res){
    var email = req.body.email;

     if(!validate.isEmail(email) || validate.isEmpty(email)){
        res.status(400).json({success:false,message:message.invalidEmail});
     }

      User.find({email:email},function(err,users){
        if(err) res.json({success:false,message:message.networkErr});
        var user = users[0];
        if(users.length > 0){
            var config = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL 
                auth: {
                    user: 'krupa.patel.sa@gmail.com',
                    pass: 'krupa@123'
                }
            };

            // create reusable transporter object using the default SMTP transport 
            var transporter = nodemailer.createTransport(config);

            // setup e-mail data
            var mailOptions = {
                from: '"EMS System" <krupa.patel.sa@gmail.com>',
                to: user.email,
                subject: 'Forgot password request',
                text: 'Hello ' + user.fullName + ', your passsword is, \n password ==> ' + user.password
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                res.json({ success: true, message: message.successForgotPass});
            });
        }       
   });
};

//-----------------------------------------
    //POST : /user/deleteUser
    //User delete
//-----------------------------------------

exports.deleteUser = function(req,res){
    if(validate.isEmpty(req.body.id)){
        res.status(400).json({success: false, message: message.idNotFound});
    }
    User.findOneAndRemove({_id:req.body.id},function(err,user){
        if(err){
            res.status(400).json({success: false, message: message.errDeleteUser});
        }else{
            console.log(user)
            if(user){
                res.json({success: true, message: message.successDeleteUser});
            }else{
                res.status(404).json({success: false, message: message.userNotFoundForDelete});
            }
        }
    });
};

//-----------------------------------------
    //POST : /user/getUserById
    //get user by Id
//-----------------------------------------

exports.getUserById = function(req,res){
    if(validate.isEmpty(req.body.userId)){
        res.json({success: false, message: message.idNotFound});
    }
    User.findOne({_id:req.body.userId},function(err,user){
        if(err){
            res.status(400).json({success: false, message: message.errUserInfo});
        }else{
            if(user){
                res.json({success: true, message: message.msgUserInfo ,userData:user});
            }else{
                res.status(404).json({success: false, message: message.userNotFoundForDelete});
            }
        }
    });
};

//-----------------------------------------
    //POST : /user/updatePassoword
    //update user passsword
//-----------------------------------------

exports.updatePassoword = function(req,res){
    console.log(req);
    if(validate.isEmpty(req.body.password)){
        res.status(400).json({success: false, message: message.emptyCurrentPassword});
    }else if(validate.isEmpty(req.body.newPassword)){
        res.status(400).json({success: false, message: message.emptyNewPassword});
    }

    User.findOne({_id:req.body.userId},function(err,user){
        if(err){
            res.status(400).json({success: false, message: message.errUserInfo});
        }else{
            if(user){
               console.log(user);
                if(bcrypt.compareSync(req.body.password, user.password)){
                      let salt = bcrypt.genSaltSync(saltRounds); //generate salt
                      var encryptNewPass = bcrypt.hashSync(req.body.newPassword,salt);
                      user.password = encryptNewPass
                    user.save(function(err){
                        if(err){
                            res.status(500).json({success: false, message: message.networkErr});
                        }else{
                            res.json({success: true, message: message.updatePassSuccess});
                        }
                    });
                }else{  
                    res.status(404).json({success: false, message: message.passwordNotMatch});
                }

            }else{
                 res.status(404).json({success: false, message: message.userNotFoundForDelete});
            }
        }
    });
};

//-----------------------------------------
    //POST : /user/getUserById
    //get user by Id
//-----------------------------------------

exports.getUserByName = function(req,res){
    var name = req.body.fname;
    if(validate.isEmpty(name)){
        res.json({success: false, message: message.emptyuser});
    }
    User.findOne({_id:req.body.userId},function(err,user){
        if(err){
            res.status(400).json({success: false, message: message.errUserInfo});
        }else{
            if(user){
                res.json({success: true, message: message.msgUserInfo ,userData:user});
            }else{
                res.status(404).json({success: false, message: message.userNotFoundForDelete});
            }
        }
    });
};

//-----------------------------------------

// POST /user/getUsers

//-----------------------------------------


exports.getUsers = function (req, res) {
    // var name = req.body.fname;

    //  if(validate.isEmpty(name.length < 1)){
    //    res.status(400).json({ success: false, message: message.emptyuser});
    // }

  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    console.log(userMap)
    res.send(userMap);  
  });


};