const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  //passportLocalMongoose will automatically define username and password which has salt and hashed form os we dont have to add username and password
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
