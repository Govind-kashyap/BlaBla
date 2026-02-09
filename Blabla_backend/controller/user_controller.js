const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Ride = require("../models/ride");
const BookingDetails = require("../models/BookingDetails");

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message :"invalid Email or password"});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }


        const userdata = {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            rating: user.rating,
        }

        req.session.user = {
            id: user._id,
            email: user.email
        }

        res.status(200).json({success: "Login Successfully", user: userdata});
    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const register = async (req, res) => {
    const {username, password, email, phoneNumber, rating} = req.body;

    try {
        const existingUser = await User.findOne({email, phoneNumber});
        if(existingUser){
            if(existingUser.email === email){
                return res.status(400).json({message: "User Already exists in this Email"});
            }
            if(existingUser.phoneNumber === phoneNumber){
                return res.status(400).json({message: "User Already exists in this Phone Number"});
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            phoneNumber,
            rating: 0,
        });

        await newUser.save();
        res.status(201).json({success: "User Register Successfully"});
    } catch (err){
        console.log("Error in register: ", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(req.body)

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetpass = token;
    user.resetpassExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });


    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ success: true, message: "Reset link sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetpass: token,
      resetpassExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetpass = undefined;
    user.resetpassExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const AddRide = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { from, to, date, departure_time, price, total_seat } = req.body;

    if (!from || !to || !date || !departure_time || !price || !total_seat) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    /*  Past date / time check */
    const rideDateTime = new Date(`${date}T${departure_time}`);
    const now = new Date();

    if (rideDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: "You can only create rides for future time"
      });
    }

    /* 2 Duplicate ride check (same user, same route, same time) */
    const existingRide = await Ride.findOne({
      user: req.session.user.id,
      from: from,
      to: to,
      date: date,
      departure_time: departure_time
    });

    if (existingRide) {
      return res.status(409).json({
        success: false,
        message: "You already created a ride for this route and time"
      });
    }

    /* Create ride */
    const ride = new Ride({
      from,
      to,
      date,
      departure_time,
      price,
      total_seat,
      user: req.session.user.id
    });

    await ride.save();

    res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride
    });

  } catch (err) {
    console.log("AddRide error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const MyRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      user: req.session.user.id
    }).sort({ createdAt: -1 });

    res.json({ success: true, rides });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRide = async (req, res) => {
  try {
    const rideId = req.params.id;

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      user: req.session.user.id
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found or not authorized"
      });
    }

    await Ride.findByIdAndDelete(rideId);

    res.json({
      success: true,
      message: "Ride deleted successfully"
    });

  } catch (err) {
    console.log("Delete ride error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const rideRequests = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.session.user.id });

    const rideIds = rides.map(r => r._id);

    const requests = await BookingDetails.find({
      ride: { $in: rideIds },
      status: "pending"
    }).populate("user", "username phoneNumber email")
      .populate("ride");

    res.json({ requests });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};


const searchRides = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const query = {};

    // From city
    if (from) {
      query["from.name"] = { $regex: from, $options: "i" };
    }

    // To city
    if (to) {
      query["to.name"] = { $regex: to, $options: "i" };
    }

    // Date filter 
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    console.log("FINAL QUERY:", query);

    const rides = await Ride.find(query).populate("user", "username email phoneNumber");

    res.status(200).json({ rides });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};


const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("user", "username phoneNumber");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    res.status(200).json({ ride });
  } catch (error) {
    console.error("Get ride error:", error);
    res.status(500).json({
      message: "Failed to fetch ride",
    });
  }
};


const bookRide = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.session.user.id;
    const rideId = req.params.id;

    const alreadyBooked = await BookingDetails.findOne({
      user: userId,
      ride: rideId,
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const booking = await BookingDetails.create({
      user: userId,
      ride: rideId,
      status: "pending"
    });

    res.json({
      message: "Booking request sent to ride owner",
      booking
    });

  } catch (err) {
    console.error("BOOK RIDE ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // approved | rejected

    const booking = await BookingDetails.findById(bookingId)
      .populate("ride");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure only ride owner can decide
    if (booking.ride.user.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: `Booking ${status} successfully`,
      booking
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// DRIVER: get bookings on my rides
const driverBookings = async (req, res) => {
  try {
    const myRides = await Ride.find({
      user: req.session.user.id,
    });

    const rideIds = myRides.map((r) => r._id);

    const bookings = await BookingDetails.find({
      ride: { $in: rideIds },
    })
      .populate("user", "username phoneNumber email")
      .populate("ride");

    res.json({ bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch driver bookings" });
  }
};

const myBookings = async (req, res) => {
  try {
    const bookings = await BookingDetails.find({
      user: req.session.user.id
    })
      .populate({
        path: "ride",
        populate: {
          path: "user",
          select: "username phoneNumber"
        }
      });

    res.json({ bookings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword,
    AddRide,
    MyRides,
    deleteRide,
    searchRides,
    getRideById,
    bookRide,
    myBookings,
    updateBookingStatus,
    driverBookings
};