const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const { validateListing , isLoggedIn , isOwner} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require('../contollers/listings.js');

// Index Route , Create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn , upload.single('listing[image]') ,validateListing , wrapAsync(listingController.createListing));

// New Route
router.get("/new" , isLoggedIn , listingController.newListing)

// Show Route , Update Route , Delete Route
router.route('/:id')
  .get( wrapAsync(listingController.showListing))
  .put( isLoggedIn , isOwner , upload.single('listing[image]') , validateListing , wrapAsync(listingController.updateListing))
  .delete(isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));

//Edit Route
router.get('/:id/edit' , isLoggedIn , isOwner , wrapAsync(listingController.editListing));

module.exports = router;