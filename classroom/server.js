const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
app.get("/", (req, res) => {
  res.send("HI");
});

app.use("/users", users);//“Send any request starting from /users to the users routes.”
app.use("/posts", posts);//“Send any request starting from /users to the users routes.”

app.listen(3000, (req, res) => {
  console.log("server is listening on port 3000");
});
