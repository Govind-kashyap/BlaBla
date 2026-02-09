require("dotenv").config();
const express = require('express');
const session = require("express-session");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/mongoDB")

connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

app.use("/api/user", require("./router/user_router"));


app.listen(PORT, () =>{
    console.log(`Server started port at ${PORT}`);
});