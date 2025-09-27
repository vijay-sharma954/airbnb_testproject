const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const listingSchema = require("../joi_listingschema.js");
const { loggedIn, isOwner, validateListing } = require("../loggedIn-middileware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })



// Listings Routes

router.route("/")
    .get(wrapAsync(listingController.index)) // Index (Show) Route
    .post(loggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)); // Create Route


// New Route
router.get("/new", loggedIn, listingController.newListingRenderForm)
router.get("/mountInfo", listingController.categoryListings);
router.post("/findListings", listingController.findListings);


router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // show route(Read)
    .put(loggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // Update Route
    .delete(loggedIn, isOwner, wrapAsync(listingController.destroyListing)) // Delete Route


// Edit Route
router.get("/:id/edit", loggedIn, isOwner, wrapAsync(listingController.listingEditRenderForm))

module.exports = router;