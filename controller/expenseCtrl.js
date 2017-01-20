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
    var debetor = req.body.debtUser;
    var totalAmount = req.body.totalAmount;
    var expDesc = req.body.description;
    var payerId =  req.body.payerId;
    var remainingAmt = 0

    if (validate.isEmpty(payerName)) {
        res.status(400).json({ success: false, message: message.emptyPayer });
    } else if (validate.isEmpty(debetor) || (debetor.length < 1)) {
        res.status(400).json({ success: false, message: message.emptyDebtUser });
    }else if (validate.isEmpty(expDesc)) {
        res.status(400).json({ success: false, message: message.emptyDesc });
    } else if (validate.isEmpty(totalAmount)) {
        res.status(400).json({ success: false, message: message.emptyAmount }); 
    }

    var totalDebtAmount = _.sumBy(debetor,'amount')
    console.log('totalDebtAmount===================================>',totalDebtAmount);
    console.log('Number(totalAmount)===================================>',Number(totalAmount));
    var finalAmount = Number(totalAmount) - totalDebtAmount
    
    console.log('perHeadAmount===================================>',finalAmount);
    if(finalAmount < 0){
         res.json({ success: false, message: message.invalidAmount});
    }
       finalAmount = Number(req.body.totalAmount) / debetor.length;

    
    _.forEach(debetor,function (debtUserValue) {
            debtUserValue.amount -= finalAmount;
    console.log('##&&&&&####',finalAmount)
    console.log('??????',debtUserValue.amount)
            if(payerId === debtUserValue.debtId)
            {
                debtUserValue.amount += Number(totalAmount);
                remainingAmt = debtUserValue.amount;
             console.log('############',remainingAmt)

            }
             console.log('=====+++++======',debtUserValue)
    });

//     for (debtor)

// if debt.id != payerid
// {
// 	bal += rem/debtor.count - 1
// }



    _.forEach(debetor,function (value) {
        if (value.amount) {
            value.amount = Number(value.amount);
            value.amount += finalAmount;
        } else {
            value.amount = finalAmount;
        }
    });

    console.log('**********************************',debetor)

    var expenseObj = new Expense({
        createdBy: req.body.userId,
        payer: payerName,
        payerId: req.body.payerId,
        debtUsers: debetor,
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