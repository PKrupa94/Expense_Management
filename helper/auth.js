var express = require('express');
var apiRoutes = express.Router(); // get an instance of the router for api routes
var jwt = require('jsonwebtoken');
var config = require('../config');


apiRoutes.use(function(req,res,next){

    var token = req.body.secret_token || req.query.secret_token || req.headers['x-access-token'];
    //decode token
    if(token){
        // verifies secret
        jwt.verify(token,config.secret,function(err,decode){
            if(err){
                res.json({success:false,message:'Invalid Token'});
            }else{
                req.decode =  decode;
                next();
            }
        });

    }else{
        res.status(403).json({success:false,message:'No token provided'}); //403:Forbidden and user is not authorize to view any data
    }
});