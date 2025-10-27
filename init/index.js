//initialization logic

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connecteding to db");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68fcf4ea4f88a9a228ec5b74",
  })); //initializing the data with the owner 68fcf4ea4f88a9a228ec5b74
  await Listing.insertMany(initData.data); //initData is an object in that we want to acces data key
  console.log("data was initialized");
};
initDB();
