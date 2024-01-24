const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: Number,
    },
    agreementId: {
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
const User = mongoose.model("User", userSchema);
module.exports = User;