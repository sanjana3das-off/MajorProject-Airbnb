const express = require("express");
const router = express.Router(); //creating router objet

// route
//index
router.get("/", (req, res) => {
  res.send("Get for posts");
});
//show
router.get("/:id", (req, res) => {
  res.send("Get for show posts ID");
});
//post
router.post("/", (req, res) => {
  res.send("post for posts");
});
//delete
router.delete("/:id", (req, res) => {
  res.send("DELETE FOR posts");
});

module.exports = router;
