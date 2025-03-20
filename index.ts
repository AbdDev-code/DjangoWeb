const express = require("express");
const dotenv = require("dotenv");
const { PORT } = require("./constants");
const session = require("express-session");
const passport = require("passport");
require("colors");
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport');

// Routes
app.use("/api/auth", require("./routers/auth.routes"));

const connectDB = require("./config/database");
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgBlue);
});