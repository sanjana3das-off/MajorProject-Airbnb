const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
//index route-setting ejs
const path = require("path"); //next create  a foldername views
const { log } = require("console");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); //  Add this line
app.use(express.urlencoded({ extended: true })); //all the data coming in the request is getting parsed

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const { listingSchema, reviewSchema } = require("./schema.js");

//**************************************************************************** */
app.use(express.static(path.join(__dirname, "/public")));
app.listen(8080, () => {
  console.log("app is listening on port 8080");
});

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
app.get("/", (req, res) => {
  res.send("home route");
});

//2) connect to database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

////example
// app.get("/testListing", async (req, res) => {
//   //3)now we will be creating sample document
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the Cruise",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("succesful testing");
//   res.send("succesful testing");
// });

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

const validateSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//index route
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let allListing = await Listing.find({}); //
    res.render("listings/index.ejs", { allListing });
  })
);
//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route - printing data of individual listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for Title");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    res.redirect(`/listings/`);
  })
);

//Review model Routes
//post route
app.post(
  "/listings/:id/reviews",
  validateSchema,
  wrapAsync(async (req, res) => {
    //why async because we are going to data on database which is an asychronous process
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);
//delte Route for Review==here we are
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

//sending standard response for * match all the routes above and if it didnot match then send response of page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//custom middleware for error handling server side
app.use((err, req, res, next) => {
  //first wee will destrut from error messgae
  let { statusCode = 500, message = "Something went Wrong " } = err; //the above error wil be catch here

  // res.status(statusCode).send(message); // and it will send the response
  res.status(statusCode).render("error.ejs", { message });
});
app.get("/debug", async (req, res) => {
  const listings = await Listing.find({});
  res.send(listings);
});
