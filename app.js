if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log('connected to database');
  })
  .catch(err => {
    console.log(err);
  })

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" , () => {
  console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
  store,
  secret: "process.env.SECRET",
  resave: false ,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7,
    httpOnly: true, // to prevent from cross scripting attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/" , (req , res) => {
//     res.send("Hi , I am Root");
// })

app.use((req , res , next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.all("*" , (req , res , next) => {
  next(new ExpressError(404 , "Page Not Found!"));
});

// Error Handling Middleware
app.use((err , req , res , next) => {
  let {statusCode=500 , message='something went wrong'} = err;
  res.status(statusCode).render("error.ejs" , {err});
  // res.status(statusCode).send(message);
})

app.listen(8080 , (req , res) => {
    console.log("server is listening to port 8080");
});
