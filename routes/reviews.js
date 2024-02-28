const express = require("express");
const router = express.Router({mergeParams: true});
const { listingSchema , reviewSchema } = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { postReview, destroyReview } = require("../contollers/review.js");

// Reviews 
// Post Route
router.post("/" ,
    isLoggedIn , 
    validateReview,
    wrapAsync(postReview));
  

  // Delete Review Route
  router.delete('/:reviewsId' ,
    isLoggedIn , 
    isReviewAuthor ,
    wrapAsync(destroyReview));
  
module.exports = router;