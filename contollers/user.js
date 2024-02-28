const passport = require("passport");
const User = require('../models/user.js');

module.exports.renderSignup = (req , res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req , res) => {
    try {
        let { username , email , password } = req.body;
        let fakeUser = new User({username , email});

        let registeredUser = await User.register(fakeUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success" , "Welcome to WanderLust!");
            res.redirect('/listings');
        })
    } catch(err) {
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req , res) => {
    res.render('users/login.ejs');
};

module.exports.logIn =  async (req , res) => {
    req.flash("success" , "Welcome Back! to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logOut = (req , res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }     
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
};