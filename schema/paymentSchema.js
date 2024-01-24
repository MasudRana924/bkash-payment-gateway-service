const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },
    trxID: {
        type: String,
    },
    paymentID: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;