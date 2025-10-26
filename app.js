const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); //next create  a foldername views
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

//session
const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 *24*60*60*1000 expiresa after 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security
  },
};

//to use the session
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("home route");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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

//*********************************************************************************************** */
// *******************************************************************************************************
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
// //demo user
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "fake@gmail.com",
//     username: "sigma-student",
//   });
//   const registeredUser = await User.register(fakeUser, "helloworld"); //helloworld is the password
//   res.send(registeredUser);
// });
