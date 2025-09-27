require("dotenv").config();
let data = require("../init/data");
const Listing = require("../models/listing.js");
let owner = "68110fa49c346f3639657ced";
let mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(ATLASDB_URL);
}

async function create(data) {
  const arr = data.data;
  for (const d of arr) {
    const newListing = new Listing({
      title: d.title,
      description: d.description,
      image: {
        filename: d.image.filename,
        url: d.image.url,
      },
      price: d.price,
      location: d.location,
      country: d.country,
      owner: owner,
    });

    await newListing.save();
    console.log(`Saved listing: ${newListing.title}`);
  }
}
create(data);
