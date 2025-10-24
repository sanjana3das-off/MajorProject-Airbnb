const express = require("express");
const router = express.Router();//creating router objet

//users route
//index
router.get("/", (req, res) => {
  res.send("Get for users");
});
//show
router.get("/:id", (req, res) => {
  res.send("Get for show users ID");
});
//post
router.post("/", (req, res) => {
  res.send("post for users");
});
//delete
router.delete("/:id", (req, res) => {
  res.send("DELETE FOR USERS");
});

module.exports = router;