const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.get("/testListing", async (req, res) => {
  //3)now we will be creating sample document
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the Cruise",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("succesful testing");
  res.send("succesful testing");
});
