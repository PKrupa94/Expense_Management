const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Expense = require('../models/expense'); //load expense module
const User = require('../models/user'); //load user module

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
    var payerId = req.body.payerId;
    var remainingAmt = 0

    if (validate.isEmpty(payerName)) {
        res.status(400).json({ success: false, message: message.emptyPayer });
    } else if (validate.isEmpty(debetor) || (debetor.length < 1)) {
        res.status(400).json({ success: false, message: message.emptyDebtUser });
    } else if (validate.isEmpty(expDesc)) {
        res.status(400).json({ success: false, message: message.emptyDesc });
    } else if (validate.isEmpty(totalAmount)) {
        res.status(400).json({ success: false, message: message.emptyAmount });
    }

    var totalDebtAmount = _.sumBy(debetor, 'amount')
    var finalAmount = Number(totalAmount) - totalDebtAmount



    if (finalAmount < 0) {
        res.json({ success: false, message: message.invalidAmount });
    }
    finalAmount = Number(req.body.totalAmount) / debetor.length;


    _.forEach(debetor, function (debtUserValue) {

        debtUserValue.amount -= finalAmount;
        // if(payerId === debtUserValue.debtId)
        // {
        //     debtUserValue.amount = -(debtUserValue.amount);
        //     debtUserValue.amount -= totalAmount;

        // }

        console.log('(())+++++(())', debtUserValue.amount)
    });

    console.log('**********************************', debetor)

    var expenseObj = new Expense({
        createdBy: req.body.userId,
        payer: payerName,
        payerId: req.body.payerId,
        debtUser: debetor,
        totalAmount: totalAmount,
        description: expDesc
    });


    expenseObj.save(function (err, createdExpense) {

        if (err) {
            console.error(err);
            res.status(400).json({ message: 'Error creating expense!!!' });
        } else {
             req.totalAmount = Number(totalAmount);
             req.debtor = debetor;
             findPayer(req, res);
            // res.json({ success: true, message: 'Saved Expense' })
        }
       
    });


}




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
            req.debtor = expResult.debtor;
            req.totalAmt = expResult.totalAmount;
            req.payerID = expResult.payerId;
            req.isDelete = true;
            var payerObj;
            findPayer(req, res);
        } else {
            res.status(404).json({ message: "expense not found with the given id" });
        }
    });
};


function findPayer(req, res) {
   
    var payerID = req.body.payerID;
    console.log('*********22222******************', payerID)
    var totalAmount = req.body.totalAmount;
    var debtor = req.body.debtor;
    var isRefund = req.body.isDelete;
     console.log('*******payerID************', payerID)


    User.findById(payerID, (err, user) => {
        if (err) {
            res.status(404).json({ success: false, message: 'No user found with the given payerId' });
        }

        if (user) {
                   console.log('************USERRRRRRR************', user)

            if (isRefund === true) {
                user.balance -= Number(totalAmount);
            } else {
                user.balance += Number(totalAmount);
            }
            user.save((err) => {
                if (err) {
                    console.log("Save error " + err);
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
                done(req);
                console.log("Expense added in " + req.body.payerId);
                 req.totalAmount = Number(totalAmt);
                  req.payer = user;
                 req.debtor = debtor;
             updateExpenseforPayerNUser(req, res);
            });


        } else {
            res.status(404).json({ success: false, message: 'No user found with the given payerId' });
        }
    });
}


function updateExpenseforPayerNUser(req, res) {

    var payer = req.body.payer;
    var payerID = req.body.payer.payerID;
    var debtUsers = req.body.debtor
    var totalAmount = req.body.totalAmount;
    var debtIds = [];
    _.forEach(debtUsers, function (debtUser) {
        debtUserValue.amount -= finalAmount;
        if (payerID === debtUser.debtId) {
            debtUser.amount += Number(totalAmt);
            user.save((err) => {
                if (err) {
                    console.log("Save error " + err);
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
            });
        }

        debtIds.push(debtUser.debtId);
        console.log('(())+++++(())', debtUser.amount);
        console.log('(())debtIds(())', debtIds);
    });

};
