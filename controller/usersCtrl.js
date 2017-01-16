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
        if(err) res.json({success:false,message:message.loginFail});
        if (users.length > 0){
              if (bcrypt.compareSync(password, users[0].password)) {
                var token = jwt.sign({id:users[0].id},config.secret);
                res.json({ success: true, message: message.successLogin, user: users[0],secret_token:token});
            } else {
                res.status(400).json({ success: false, message: message.errorLogin});
            }
        }else{
            res.status(400).json({success:false,message:message.userNotFound});
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
            isAdmin : admin
        });
        //save data into database
        userData.save(function(err,userValue){
            if(err) res.json({success:false,message:message.registrationFailed}); 
            console.log(userValue)
            res.status(200).json({success:true,message:message.successRegister});
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
            var transporter = nodemailer.createTransport(config);

            var mailOptions = {
                from: '"EMS System" <krupa.patel.sa@gmail.com>',
                to: user.email,
                subject: 'Forgot password request',
                text: 'Hello ' + user.fullName + ', your passsword is, \n password ==> ' + user.password
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                res.json({ success: true, message: message.successForgotPass});
            });
        }       
   });




};