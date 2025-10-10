const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
//index route-setting ejs
const path = require("path"); //next create  a foldername views
const { log } = require("console");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //all the data coming in the request is getting parsed

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));
app.listen(8080, () => {
  console.log("app is listening on port 8080");
});

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

//index route
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({}); //
  res.render("listings/index.ejs", { allListing });
});
//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route - printing data of individual listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// create route
app.post("/listings", async (req, res) => {
  // let { title, description, image, price, country, location } = req.body;

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  res.redirect(`/listings/`);
});
