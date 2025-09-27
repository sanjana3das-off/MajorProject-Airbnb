const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.listen(8080, () => {
  console.log("app is listening on port 8080");
});

app.get("/", (req, res) => {
  res.send("home route");
});

//2) connect to database

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(()=>{console.log("connected to db");
  })
    .catch((err) => console.log(err));
  
