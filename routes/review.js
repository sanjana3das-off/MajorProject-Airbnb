const express = require("express");
const router = express.Router({ mergeParams: true }); //creating router object,// mergeParams: true lets this router use parameters from the parent rou
const wrapAsync = require("../utils/wrapAsync.js");

const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");

//Review model Routes
//post route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    //why async because we are going to data on database which is an asychronous process
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
  })
);
//delte Route for Review==here we are
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("failure", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
