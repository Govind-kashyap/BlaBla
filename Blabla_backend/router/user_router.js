const express = require("express");
const router = express.Router();
const isAuth = require("../Middleware/isAuth")
const upload = require("../Middleware/upload");
const User = require("../models/user")


const {
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
    driverBookings,
    updateBookingStatus,
    updateProfileImage
} = require("../controller/user_controller");

router.post("/login", login);
router.post("/register", register);
router.post("/upload-profile",isAuth,upload.single("profile"),updateProfileImage);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/addRide", isAuth, AddRide);
router.get("/addRide", isAuth, AddRide);
router.get("/my-rides", isAuth, MyRides);
router.delete("/ride/:id", isAuth, deleteRide);
router.get("/search-rides",isAuth, searchRides);
router.get("/ride/:id", isAuth, getRideById);
router.post("/book-ride/:id", isAuth, bookRide);
router.get("/my-bookings", isAuth, myBookings);
router.get("/driver-bookings", isAuth, driverBookings);
router.put("/booking/:bookingId", isAuth, updateBookingStatus);



router.get("/me", isAuth, async (req, res) => {
  const user = await User.findById(req.session.user.id).select(
    "username email profileImage rating phoneNumber"
  );

  res.json({
    success: true,
    user
  });
});


router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Logged out" });
    });
});

module.exports = router;