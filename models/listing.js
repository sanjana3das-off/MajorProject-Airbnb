const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// creating a variable Schema so instead of using mongoose.Schema we will use Schema

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          : v, // If the value 'v' is an empty string, set it to default; otherwise keep v
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

// now by using this schema we will create a model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
