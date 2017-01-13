//-----------------------------------------
    //get the packeges
//-----------------------------------------

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan'); // log requests to the console
var mongoose    = require('mongoose'); //interact with our MongoDB database

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../EMS/config'); // get our config file
var User   = require('../EMS/models/user'); // get our mongoose model


//-----------------------------------------
    //Configuration
//-----------------------------------------
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('userSecret',config.secret); // secret variable 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/setUp', function(req, res) {
    console.log('setup--------------------------->')
    var user = new User({
        email :'test@123.gmail.com',
        password:'test',
        name:'krupa',
        mobileNo:'123456789'
    });

    user.save(function(err){
        if(err) throw err;
        console.log("User Saved");
        res.json({success:true});
    });

    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
// ---------------------------------------
// start the server 
// ---------------------------------------

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
