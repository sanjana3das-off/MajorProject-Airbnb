const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); //next create  a foldername views
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

//**************************************************************************** */
//2) connect to database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
  console.log("connected to db");
})
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//index route-setting ejs
const { log } = require("console");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); //  Add this line
app.use(express.urlencoded({ extended: true })); //all the data coming in the request is getting parsed
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
  res.send("home route");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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

app.listen(8080, () => {
  console.log("app is listening on port 8080");
});




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
