const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// app.use(session({secret:"mysupersecretstring"}));


const sessionOption =   {secret:"mysupersecretstring",
    resave:false , 
    saveUninitialized:true
        };
app.use(session(sessionOption));
app.use(flash());

app.use((req ,res , next)=>{
    res.locals.messages = req.flash("success");
    next();
    
});

        app.get("/register",(req ,res)=>{
            let{name = "anonymous"} = req.query;
            req.session.name = name;
            req.flash("success","user resgistered successfuly");
            res.redirect("/hello");
        });

        app.get("/hello",(req ,res)=>{
        //    console.log(req.flash("success"));
            // res.send(`hello ${req.session.name}`);

            // res.locals.messages = req.flash("success");
            res.render("page.ejs" , {name: req.session.name });
        });
// app.use(
//     session(
//         {secret:"mysupersecretstring",
//         resave:false , 
//         saveUninitialized:true
//             })
//         );


// app.get("/request",(req ,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`you requested session for ${req.session.count}`);
// });

// app.get("/test",(req ,res)=>{
// res.send("test successfuly!");
// });

// app.use(cookieParser());

// app.use(cookieParser("secretcode"));

//send signed cookie

// app.get("/getsignedcookie",(req ,res)=>{
//     res.cookie("made_in","india",{signed:true});
//     res.send("signed cookie send");
// });

//verify cookie

// app.get("/verify",(req ,res)=>{
//     console.log(req.signedCookies);
//     res.send("verifyed");
// });
// app.get("/getcookies",(req, res)=>{
//     res.cookie("greet","namste");
//     res.cookie("madeIn" ,"India");
//     res.send("we have just send someCookies ");
// });

// app.get("/",(req ,res)=>{
//   console.dir(req.cookies);
//     res.send("This is root");
// });


// app.get("/greet",(req,res)=>{
//     let {name = "annonym"} = req.cookies;
//   res.send(`Hi ${name}`);
// });

app.listen(8080, () => {
    console.log("listening to the port 8080");
  });
  