const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
    payer: {
        type: String,
        required: true
    },
    payerId: {
        type: String,
        required: true
    }, 
    createdBy: {
        type:String,
        required:true
    },
    debtUser: [{
        debtId: {
            type: String,
            required: true
        },debtName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    description: {
        type:String,
        required:true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    expenseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
