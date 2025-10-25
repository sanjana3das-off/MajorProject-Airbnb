const express = require("express");
const router = express.Router(); //creating router objet

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

//step3-Server side validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    // `error` is the object returned by Joi when validation fails
    // It contains details about each validation failure in an array called `details`

    // Map over each element in the error.details array
    // `el` represents one validation error object
    let errMsg = error.details
      .map((el) => el.message) // extract the human-readable message from each error
      .join(","); // join all messages into a single string, separated by commas
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//index route
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    let allListing = await Listing.find({}); //
    res.render("listings/index.ejs", { allListing });
  })
);
//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route - printing data of individual listing
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("failure", "listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);
//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("failure", "listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for Title");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("failure", "Listing Deleted");
    res.redirect(`/listings/`);
  })
);

module.exports = router;
