const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const config = require('../config'); //get config file
const validate = require('../helper/validation'); //get validation file
const message = require('../helper/messages'); //get alertMessages file
const saltRounds = 5; 


//-----------------------------------------
    //POST : /expens/addExpense
    //Add expense of users
//-----------------------------------------



exports.addExpense = function (req, res) {

    var payerName = req.body.payer;
    var debtUsers = req.body.debtUser;
    var totalAmount = req.body.amount;
    var expDesc = req.body.description;
    var expTitle = req.body.title;
if (validate.isEmpty(payerName)) {
res.status(400).json({ success: false, message: message.emptyPayer });
} else if (validate.isEmpty(debtUsers) || (debtUsers.length < 1)) {
res.status(400).json({ success: false, message: message.emptyDebtUser });
}else if (validate.isEmpty(expTitle)) {
res.status(400).json({ success: false, message: message.emptyDesc });
} else if (validate.isEmpty(expDesc)) {
res.status(400).json({ success: false, message: message.emptyDesc });
} else if (validate.isEmpty(totalAmount)) {
res.status(400).json({ success: false, message: message.emptyAmount });
}
}