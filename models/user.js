var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var userSchema = new Schema({
    email:{
        type: String,
        require : true,
        unique: true
    },
    password: {
        type: String,
        require : true
    },
    name: {
        type : String,
        require : true
    }, 
    isAdmin: {
        type:Boolean,
        default: false
    },
    mobileNo: String,
    secret_token : String
});

module.exports = mongoose.model("User",userSchema);