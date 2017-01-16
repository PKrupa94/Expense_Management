var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt'); // Load the bcrypt module
var User = require('../models/user');
var config = require('../config');

const saltRounds = 5; 


//-----------------------------------------
    //POST : /user/login
    //User Login
//-----------------------------------------

exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    if(req.body.email.length == 0 || req.body.password.length == 0){
        res.json({success:false,message:'All Fields are required'});
    }


    User.find({email : email},function(err,users){
        if(err) res.json({success:false,message:'Login Failed'});
        if (users.length > 0){
              if (bcrypt.compareSync(password, users[0].password)) {
                var token = jwt.sign({id:users[0].id},config.secret);
                res.json({ success: true, message: 'You are successfully login', user: users[0],secret_token:token});
            } else {
                res.status(400).json({ success: false, message: 'Please check your email and password' });
            }
        }else{
            res.status(400).json({success:false,message:'User is not register'});
        }
    });
};


//-----------------------------------------
    //POST : /user/userRegister
    //User registration
//-----------------------------------------

exports.userRegister = function(req,res){
   
   var email = req.body.email;

   User.find({email:email},function(err,users){
        if(err) res.json({success:false,message:'something went wrong'});

        if(users.length > 0){
            res.json({success:false,messgae:'Already registed User'});
        }else{
            var salt = bcrypt.genSaltSync(saltRounds); //generate salt
            var encryptPass = bcrypt.hashSync(req.body.password,salt); // Hash the password with the salt
            var name = req.body.name;
            var email = req.body.email;
            var mobileNo = req.body.mobileNo;
            var password = encryptPass;
            var admin = req.body.isAdmin ;
        }

        var userData = new User({
            name : name,
            email : email,
            password : password,
            mobileNo : mobileNo,
            isAdmin : admin
        });

        userData.save(function(err,userValue){
            if(err) res.json({success:false,message:'User registration failed'}); 
            console.log(userValue)
            res.status(200).json({success:true,message:'User successfully created'});
        });
   });
};