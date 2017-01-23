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
    });

    req.updateDebtData = debtUserValue;

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
            res.status(400).json({ message: message.errAddExpense });
        } else {
           // res.json({ success: true, message: message.savedExpense })
            updateDebtUserData(req, res)
        }
    });
}

function updateDebtUserData(req, res) {
    let debtData = req.updateDebtData;
    var debtIds = _.map(debtData, 'debtId');

    User.findById(req.body.payerId, function (err, user) {
        if (err) {
            res.status(404).json({ success: false, message: message.payerIdNotFound });
        } else {
            if (user) {
                user.balance += Number(req.body.totalAmount);
                user.save((err) => {
                    if (err) {
                        res.status(500).json({ success: false, message: message.networkErr });
                    }
                })
            }
            else {
                res.status(404).json({ success: false, message: message.payerIdNotFound });
            }
        }
    })
    User.find().where('_id').in(debtIds).exec(function (err, debtUsers) {
        if (err) {
            res.status(500).json({ success: false, message: message.networkErr });
        }
        if (debtUsers.length > 0) {
            for (i = 0; i < debtUsers.length; i++) {
                let objDebt = _.find(debt, { 'debtId': debtUsers[i]._id.toString() });
                let options = {
                    user: debtUsers[i],
                    amount: objDebt.amount,
                    res: res,
                    req: req
                }
                debtUsers[i].balance -= objDebt.amount;
                debtUsers[i].save((err) => {
                    if (err) {
                        res.status(500).json({ success: false, message: message.networkErr});
                    }
                        res.status(200).json({ message: message.savedExpense});
                });
            }
        }
    });
};



