const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});

    res.render("./listings/index.ejs", { allListing });
}

module.exports.renderNewForm =    ( req, res) => {
  

    res.render("./listings/new.ejs");
  
  };
  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
  
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
    },
  }).populate("owner");
    if(!listing){
      req.flash("error","Listings you requested for does not exist");
     return res.redirect("/listings");
    }
  
    res.render("./listings/show.ejs", { listing });
  
  };

  module.exports.createListings =  async (req, res , next) => {
    // let{title, image, description, counrty, location, price} = req.body;
  
  //  let result =listingSchema.validate(req.body); 
  //  console.log(result);
  //  if(result.error){
  //   throw new ExpressError(404, result.error);
  //  }
  
    let listing = req.body.listing;
    
    const newListing = await new Listing(listing); 
    console.log(req.user);
    newListing.owner = req.user._id;
    // if( !newListing.discription){
    //   throw new ExpressError(404,"Discription missing");
    // }
    // if( !newListing.title){
    //   throw new ExpressError(404,"title missing");
    // }
    // if( !newListing.country){
    //   throw new ExpressError(404," country missing");
    // } 
    await newListing.save();
    req.flash("success","new Listings Created!");
    res.redirect("/listings");
  
  
  };

  module.exports.renderEditForm = async(req ,res)=>{

    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("./listings/edit.ejs", { listing});
  };
  module.exports.updateListing = async (req ,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
      throw new ExpressError(400 , "send valid data for listings")
    }
  
  
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success"," Listings Updated");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing =async (req , res)=>{
    let {id} = req.params;
     let deleteListings=await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash("success","Listings Deleted!");
    res.redirect("/listings");
  };