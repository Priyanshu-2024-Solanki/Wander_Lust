const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { route } = require("./listing.js");
const { saveDirectUrl } = require("../middleware.js");
const { renderSignup, signUp, renderLogin, logIn, logOut } = require("../contollers/user.js");
const passport = require("passport");

router.route('/signup')
  .get(renderSignup)
  .post( wrapAsync(signUp));


router.route('/login')
  .get( renderLogin)
  .post(saveDirectUrl , passport.authenticate("local", {
    failureRedirect: '/login', 
    failureFlash: true
}),logIn)

router.get("/logout" , logOut);

module.exports = router;