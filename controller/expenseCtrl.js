const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Expense = require('../models/expense'); //load user module
const config = require('../config'); //get config file
const validate = require('../helper/validation'); //get validation file
const message = require('../helper/messages'); //get alertMessages file
const _ = require('lodash');


//-----------------------------------------
    //POST : /expens/addExpense
    //Add expense of users
//-----------------------------------------


exports.addExpense = function (req, res) {
    var payerName = req.body.payer;
    var debtUsers = req.body.debtUser;
    var totalAmount = req.body.totalAmount;
    var expDesc = req.body.description;

    if (validate.isEmpty(payerName)) {
        res.status(400).json({ success: false, message: message.emptyPayer });
    } else if (validate.isEmpty(debtUsers) || (debtUsers.length < 1)) {
        res.status(400).json({ success: false, message: message.emptyDebtUser });
    }else if (validate.isEmpty(expDesc)) {
        res.status(400).json({ success: false, message: message.emptyDesc });
    } else if (validate.isEmpty(totalAmount)) {
        res.status(400).json({ success: false, message: message.emptyAmount }); 
    }

    var totalDebtAmount = _.sumBy(debtUsers,'amount')
    var finalAmount = Number(req.body.totalAmount) - totalDebtAmount

    if(finalAmount < 0){
         res.json({ success: false, message: message.invalidAmount});
    }

   finalAmount = Number(req.body.totalAmount) / debtUsers.length;
   console.log('perHeadAmount===================================>',finalAmount);
    _.forEach(debtUsers,function (value) {
        if (value.amount) {
            value.amount = Number(value.amount);
            value.amount += finalAmount;
        } else {
            value.amount = finalAmount;
        }
    });

    var expenseObj = new Expense({
        createdBy: req.body.userId,
        payer: payerName,
        payerId: req.body.payerId,
        debtor: debtUsers,
        totalAmount: totalAmount,
        description: expDesc
    });

    expenseObj.save(function (err, createdExpense) {
        if (err) {
            console.error(err);
            res.status(400).json({ message: 'Error creating expense!!!' });
        }else{
            res.json({success:true,message:'Saved Expense'})
        }
       
    });


}