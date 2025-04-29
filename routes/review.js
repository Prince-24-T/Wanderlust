const express = require("express");
const router = express.Router({mergeParams:true});//
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const wrapAsync =require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLogin  ,isreviewAuthor} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

const validateReview = (req ,res ,next)=>{ //error aa rha hai do again
  let {error} = reviewSchema.validate(req.body);
  let erMsg = error.details.map((el) =>el.message).join(",");
  if(error){
    throw new ExpressError(404, erMsg);
  }
  else{
    next();
  }

}



//reviws --> post routes
router.post("/" , isLogin,   wrapAsync(reviewsController.createReview));
 
 //Delete review
 
 router.delete("/:reviewId" , isLogin, isreviewAuthor, wrapAsync(reviewsController.destroyReview));
 
 module.exports = router;