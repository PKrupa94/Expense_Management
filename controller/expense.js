const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const User = require('../models/user'); //load user module
const config = require('../config'); //get config file
const validate = require('../helper/validation'); //get validation file
const message = require('../helper/messages'); //get alertMessages file

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








//-----------------------------------------
    //POST : /expense/deleteExpense
    //Delete the expense from the balance
//-----------------------------------------


exports.deleteExpense = function (req, res, next) {

var expID = req.body.expnId;
if (validate.isEmpty(expID)) {
res.status(400).json({ message: message.emptyExpId })
}
Expense.findById(expID, (err, expResult) => {
if (err) {
res.status(500).json({ message: message.errExpDelete });
}
if (expResult) {
req.updatedDebt = expResult.debtor;

var totalAmt = expResult.totalAmount;
var payerID = expResult.payerId;
req.isDelete = true;
User.findById(payerID, (err, user) => {
if (err) {
res.status(404).json({ success: false, message: 'No used found with the given payerId' });
}

if (user) {
if (req.isDelete === true) {
user.balance -= Number(totalAmt);
} else {
user.balance += Number(totalAmt);
}
user.save((err) => {
if (err) {
console.log("Save error " + err);
res.status(500).json({ success: false, message: 'Something went wrong' });
}
});
} else {
res.status(404).json({ success: false, message: 'No user found with the given payerId' });
}
});
} else {
res.status(404).json({ message: "expense not found with the given id" });
}
});
};

