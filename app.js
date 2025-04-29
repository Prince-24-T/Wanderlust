if(process.env.NODE_ENV != "production"){
  require('dotenv').config()//first download env 
}

// console.log(process.env.secret) // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const listingRouters = require("./routes/listings.js");
const reviewRouters = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// const {saveRedirectUrl }= require("./middleware.js");
// const Review = require("./models/");


const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
// const {listingSchema , reviewSchema} = require("./schema.js");


// app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));
app.use(express.urlencoded({ extended: true }));//to pass data that coming into request


passport.serializeUser(User.serializeUser());///error to serialize to user into session
passport.deserializeUser(User.deserializeUser());///error to deserialize to user into session

// const dbUrl = "mongodb+srv://prince:BCA21UQJcUcS9Mt8@cluster0.dabar09.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbUrl =process.env.ATLASDB_URL;
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then((res) => {
  console.log("connection successful");
})
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);



}

// app.get("/", (req, res) => {
//   res.send(" I am Root ");
// });

const store =MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
 });

 store.on("error",()=>{
  console.log("Error on mongo-session store" , err);
 });

 const sessionOption = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookies: {
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  }
 };



 app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));



 app.use((req ,res, next)=>{
  res.locals.success= req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
 });


 app.get("/demouser", async (req, res)=>{
  let fakeuser = new User({
    email:"student@gmail.com",
    username:"delta-student"
  });
   let registerUser= await User.register(fakeuser,"helloworld");
   console.log(registerUser);
   res.send(registerUser);
 });
 app.use("/listings" ,listingRouters);

app.use("/listings/:id/reviews" , reviewRouters);

app.use("/",userRouter);

// //delete routes

// app.delete("/listings/:id", wrapAsync( async (req , res)=>{
//   let {id} = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// }));
// //update routes

// app.put("/listings/:id", wrapAsync( async (req ,res)=>{
//   let {id} = req.params;
//   if(!req.body.listing){
//     throw new ExpressError(400 , "send valid data for listings")
//   }
//   await Listing.findByIdAndUpdate(id,{...req.body.listing})
//   res.redirect("/listings");
// }));



// //edit route
// app.get("/listings/:id/edit", wrapAsync( async(req ,res)=>{

//   let {id} = req.params;
//   const listing = await Listing.findById(id);
  
//   res.render("./listings/edit.ejs", { listing});
// }));


// //create routes

// app.post("/listings", wrapAsync( async (req, res , next) => {
//   // let{title, image, description, counrty, location, price} = req.body;

// //  let result =listingSchema.validate(req.body); 
// //  console.log(result);
// //  if(result.error){
// //   throw new ExpressError(404, result.error);
// //  }

//   let listing = req.body.listing;
  
//   const newListing = await new Listing(listing);
//   // if( !newListing.discription){
//   //   throw new ExpressError(404,"Discription missing");
//   // }
//   // if( !newListing.title){
//   //   throw new ExpressError(404,"title missing");
//   // }
//   // if( !newListing.country){
//   //   throw new ExpressError(404," country missing");
//   // } 
//   await newListing.save();
//   res.redirect("/listings");


// }));

// valiadation for schema as middleware


//validate reviews
// const validateReview = (req ,res ,next)=>{
//   let {error} = reviewSchema.validate(req.body);
//   let erMsg = error.details.map((el) =>el.message).join(",");
//   if(error){
//     throw new ExpressError(404, erMsg);
//   }
//   else{
//     next();
//   }

// }


// //new routes
// app.get("/listings/new", (req, res) => {

//   res.render("./listings/new.ejs");

// });
// //show routes
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;

//   const listing = await Listing.findById(id).populate("reviews");

//   res.render("./listings/show.ejs", { listing });

// }));






// app.get("/listings", async (req, res) => {
//   const allListing = await Listing.find()



//   res.render("./listings/index.ejs", { allListing });

// });


// //reviws --> post routes
// app.post("/listings/:id/reviews" ,   wrapAsync(async(req ,res)=>{

//    let listing  = await Listing.findById(req.params.id);
//    let newReview = new Review(req.body.review);

//    listing.reviews.push(newReview);
//    await newReview.save();
//    await listing.save();
//    console.log("new Review saved");
//   res.redirect(`/listings/${listing._id}`);



// }))

// //Delete review

// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req ,res)=>{
//   let {id , reviewId} = req.params;
//   await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});

//    await Review.findByIdAndDelete(reviewId);

//    res.redirect(`/listings/${id}`)
// }));



// app.get("/listing" ,(req ,res)=>{
//     let sample = new Listing({
//         title:"My Home",
//         description:"by the beach",
//         price:1200,
//         location:"chandigarh",
//         country:"India"

//     });
//     sample.save().then((data)=>{
//         console.log(data);
//     })
//     .catch((err)=>{
//         console.log(err)
//     });

// })


app.all("*" ,(req ,res ,next)=>{
 
  next(new ExpressError(404 , "Page not Found"));
});

//error middleware
app.use((err , req ,res ,next)=>{
  let{ statusCode =500 , message="something went wrong"} =  err;

  res.render("error.ejs" ,{message});
// res.status(statusCode).send(message);

});


app.listen(8080, () => {
  console.log("listening to the port 8080");
});


