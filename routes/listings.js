const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLogin  , isOwner} = require("../middleware.js");
const flash = require("connect-flash");
const Review = require("../models/reviews.js");
const listingsController = require("../controllers/listing.js");


const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const validateListing = (req ,res ,next)=>{
  let {error} = listingSchema.validate(req.body);
  let erMsg = error.details.map((el) =>el.message).join(",");
  if(error){
    throw new ExpressError(404, erMsg);
  }
  else{
    next();
  }

}

//delete routes

router.delete("/:id", isLogin, isOwner,  wrapAsync( listingsController.destroyListing));
//update routes

router.put("/:id", isLogin, isOwner, wrapAsync( listingsController.updateListing));



//edit route
router.get("/:id/edit", isLogin, isOwner, wrapAsync( listingsController.renderEditForm));


//create routes
//for upload image -->upload.single('avatar'), 

router.post("/",   isLogin,wrapAsync(listingsController.createListings));

// router.post("/", upload.single('listing[image]'),  (req ,res)=>{
//   res.send(req.file);
// });

// image upload pending

  //new routes
  router.get("/new", isLogin,listingsController.renderNewForm);

  //show routes
  router.get("/:id", wrapAsync(listingsController.showListing));
  
  
  

  
  //index routes
  router.get("/", wrapAsync(listingsController.index));

module.exports = router;