const express = require("express");
const app = express();

const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Express Sessions

const session = require("express-session"); //bydefault jaise hi apne session ko as a middleware use kr liya uske andr secret add kr liya vaise hi har ek request k sath(get,post,update,delete) ek sessionid save hogi
const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

app.use(flash());
//middleware
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});
app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  // console.log(req.session.name); // a session has Session { cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
  //to create flash
  // req.flash("success", "user registered successfully!");

  //using res.local
  if (name === "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered succesfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});
// app.get("/test", (req, res) => {
//   res.send("test sucessfull!");
// });

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You send a request ${req.session.count} times`);
// });
app.listen(3000, (req, res) => {
  console.log("server is listening on port 3000");
});

//Cookie parser*********************************************************************************************
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");

// //to use cookie parser
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "India", { signed: true });
//   res.send("signed cookie send");
// });
// //sending cookies
// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "hello"); //greet=name ,hello=value =>keyvalue pair
//   res.send("sendind you some cookies");
// });

// app.get("/verify", (req, res) => {
//   // console.log(req.cookies);//it prints unsigned cookies
//   console.log(req.signedCookies);

//   res.send("verifid");
// });
// app.get("/greet", (req, res) => {
//   let { name } = req.cookies;
//   res.send(`hi ,${name}`);
// });
// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("HI");
// });

// app.use("/users", users); //“Send any request starting from /users to the users routes.”
// app.use("/posts", posts); //“Send any request starting from /users to the users routes.”
