const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    from: {
      name: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    to: {
      name: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    date: {
      type: Date,
      required: true,
    },

    departure_time: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    total_seat: {
      type: Number,
      required: true,
    },

    ride_status: {
      type: String,
      default: "Pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", schema);
module.exports = Ride;
