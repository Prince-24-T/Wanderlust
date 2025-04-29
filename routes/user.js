const express = require("express");
const router = express.Router();//
const wrapAsync =require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController= require("../controllers/users.js");

router.get("/signup" , userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signup));


router.get("/login" ,userController.renderLoginForm);


//  const passportMiddleware  =     passport.authenticate("local",
//     { failureRedirect: "/login" ,
//         failutreFlash: true 

//     });

// router.post(
//     "/login",
// passportMiddleware ,

// async(req , res)=>{


//     res.send("welcome to Wanderlust yor are logged in!");

// });


router.post("/login",  saveRedirectUrl,
    passport.authenticate("local",
         { failureRedirect: '/login' ,
             failureFlash:true }
            ),
            userController.login

    );


// router.post("/login" ,(req ,res)=>{


// });

router.get("/logout",userController.logOut);


module.exports = router;