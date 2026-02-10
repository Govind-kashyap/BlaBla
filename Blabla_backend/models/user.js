const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            default: ""
        },
        rating: {
            type: Number,
            default: 0,
        },
        resetpass: {
            type: String,
            default: ""
        },
        resetpassExpire:{
            type: Date,
            default: Date.now
        }
    },
    {timestamps : true}
);

const User = mongoose.model("User", schema);
module.exports = User;