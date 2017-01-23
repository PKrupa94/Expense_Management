//-----------------------------------------
    //get the packeges
//-----------------------------------------

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan'); // log requests to the console
const mongoose    = require('mongoose'); //interact with our MongoDB database
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//const config = require('../EMS/config'); // get our config file
const User   = require('./models/user'); // get our mongoose model
var config = require('./env/development');

//-----------------------------------------
    //Configuration
//-----------------------------------------
var port = config.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('userSecret',config.secret); // secret variable 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


var apiRoutes = require('../EMS/routes/api'); //get api routes
app.use('/api',apiRoutes);

var db = mongoose.connection;
db.once('open',function(){
    console.log('Database connection');
});

// ---------------------------------------
// start the server 
// ---------------------------------------

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
