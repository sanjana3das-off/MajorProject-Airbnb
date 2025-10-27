const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
//***************************************** */
// Exporting a middleware function named 'isLoggedIn'
// This function will check if a user is logged in before allowing them to continue
module.exports.isLoggedIn = (req, res, next) => {
  // If the user is not logged in
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // Show an error message saying the user must log in first
    req.flash("error", "You must be logged in to create a listing!");

    // Redirect the user to the login page
    return res.redirect("/login");
  }

  // If the user is logged in, move on to the next middleware or route handler
  next();
};

//middleware saving redirectUrl in locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
