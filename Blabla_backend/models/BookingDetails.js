const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        reuired: true,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const BookingDetails = mongoose.model("BookingDetails", schema);
module.exports = BookingDetails;