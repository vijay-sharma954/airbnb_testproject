const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, loggedIn, isReviewAuthor } = require("../loggedIn-middileware.js");
const reviewController = require("../controllers/reviews.js");



// Create Post Route for Reviews

router.post("/", loggedIn ,validateReview, wrapAsync(reviewController.createReviews))



// Delete Route for Reviews

router.delete("/:reviewId", loggedIn, isReviewAuthor ,wrapAsync(reviewController.destroyReviews))

module.exports = router;