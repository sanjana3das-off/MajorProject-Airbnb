const Joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = Joi.object({
  //joi k ander ek object
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});
//server side -validation
//step1: joi schema
//step2: require the schema
//step3 : creating a function called validateListing
//step 4; passing the function as middleware

//step1
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
