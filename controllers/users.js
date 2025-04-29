
const User = require("../models/user.js");

module.exports.renderSignUpForm = async (req ,res)=>{
    res.render("users/signup.ejs");

};

module.exports.signup =  async(req ,res , next)=>{
try{
    let{ username , email , password} = req.body;
    const newUser = new User({ email, username});

    const registerUser =   await User.register(newUser, password);
    console.log(registerUser);
req.login(registerUser, (err)=>{
    if(err){
        return(next(err));
    }
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
});
    // res.flash("success" ,"user was registered");
// res.redirect("/listings");
}catch(e){
    req.flash("error" ,e.message);
    res.redirect("/signup");
}
};

module.exports.renderLoginForm = (req ,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) =>{
    console.log(req.user);
 let redirectUrl = res.locals.redirectUrl||"/listings";
    // res.redirect("/listings");
    // res.redirect(res.locals.redirectUrl);
    res.redirect(redirectUrl);

};

module.exports.logOut = (req ,res , next)=>{
    req.logout((err)=>{
        if(err){
            next(err);

        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};
 