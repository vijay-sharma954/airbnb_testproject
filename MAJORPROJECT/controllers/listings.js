const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}

module.exports.newListingRenderForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const indiData = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!indiData) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show", { indiData });
}


// module.exports.createListing = async (req, res, next) => {
//     // For Maps
//     let response = await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//     })
//         .send()

//     let url = req.file.path;
//     let filename = req.file.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     newListing.geometry = response.body.features[0].geometry;
//     let result = await newListing.save();
//     // console.log(result);
//     req.flash("success", "Successfully created a new listing");
//     res.redirect("/listings");
// }

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Optional: set a dummy geometry if your schema requires it
    newListing.geometry = {
        type: "Point",
        coordinates: [0, 0] // Placeholder coordinates
    };

    let result = await newListing.save();

    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}



module.exports.categoryListings = async (req, res) => {
    let { category } = req.query;
    let listings = await Listing.find();
    let listingCategory = listings.filter(listing => listing.category === category);
    res.render("listings/listingCategory", { listingCategory })
}

module.exports.findListings = async (req, res) => {
    let listLocation = req.body.list.location;
    let findListings = await Listing.find();
    let foundListings = findListings.filter(listing => listing.location === listLocation);
    if (foundListings.length === 0) {
        req.flash("error", "No listings found in this location");
        return res.redirect("/listings");
    }
    res.render("listings/foundListings", { foundListings });
}


module.exports.listingEditRenderForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "This listing for edit does not exist");
        return res.redirect("/listings");
    }
    let originalListingImage = listing.image.url;
    let updateListingImage = originalListingImage.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing, updateListingImage })
}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    // console.log(result);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}