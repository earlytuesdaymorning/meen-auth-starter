// Dependencies
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const session = require('express-session');
const methodOverride = require('method-override');

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " mongo not running"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Middleware
app.use(methodOverride('_method'));
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
// Routes / Controllers
const userController = require("./controllers/users");
app.use("/users", userController);

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));



// Routes / Controllers
const sessionsController = require("./controllers/sessions");
app.use("/sessions", sessionsController);

//we want to render the index view IF the user is logged out and we want to render
//the dashboard view IF the user is logged in
app.get("/", (req, res) => {
    if (req.session.currentUser) {
        res.render('dashboard.ejs', {
            currentUser: req.session.currentUser
        });
    } else {
        res.render("index.ejs", {
            currentUser: req.session.currentUser
        });
    }
});




// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));