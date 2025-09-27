const Listing = require("../models/listing.js");

// show  all listings
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});

  res.render("./listings/index.ejs", { allListing });
};

// render new for for the upation
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//show listings
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listings you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listing });
};

// 68110fa49c346f3639657ced // owner id;
module.exports.createListings = async (req, res, next) => {
  let { title, url, description, country, location, price } = req.body;
  console.log("Form body:", req.body);

  const newListing = await new Listing({
    title,
    description,
    image: { filename: "listingImage", url },
    price: Number(price),
    location,
    country,
    owner: req.user._id,
  });

  try {
    let savedListing = await newListing.save();
    console.log("Saved listing:", savedListing);
    req.flash("success", "new Listings Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error saving listing:", err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  res.render("./listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listings");
  }

  let { listing } = req.body;
  let url = listing.image;
  let filename = listing.filename;

  let updated = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  req.flash("success", " Listings Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListings = await Listing.findByIdAndDelete(id);
  console.log(deleteListings);
  req.flash("success", "Listings Deleted!");
  res.redirect("/listings");
};
