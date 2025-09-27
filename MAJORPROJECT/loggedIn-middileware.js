const Listing = require("./models/listing.js");
const listingSchema = require("./joi_listingschema.js");
const expressError = require("./utils/expressError.js");
const reviewSchema = require("./joi_reviewSchema.js");
const Review = require("./models/review.js");

module.exports.loggedIn = ((req, res, next) => {
    // console.log(req.path, req.originalUrl);
    if (!req.isAuthenticated()) {
        //redirect URL
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
})


module.exports.saveRedirectUrl = ((req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectUrl = req.session.redirectURL
    }
    next();
});



module.exports.isOwner = (async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.User._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
})


module.exports.validateListing = ((req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        next(new expressError(400, error.message));
    } else {
        next();
    }
})


module.exports.validateReview = ((req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        next(new expressError(400, error.message));
    } else {
        next();
    }
})


module.exports.isReviewAuthor = (async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.User._id)) {
        req.flash("error", "You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
})