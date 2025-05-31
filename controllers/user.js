const User=require("../models/user.js");
module.exports.renderSignup=(req,res)=>{
    res.render('./user/signup.ejs');

};
 module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser= new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,
        (err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to Wanderlust!! ");
            let redirectLink=res.locals.redirectUrl ||"/listings";
    
        res.redirect(redirectLink);
        }
       );
        
   
    }catch(e){
        req.flash("failure","user already exists");
        res.redirect("/signup");
    }
}

module.exports.login=(req,res)=>{
    req.flash("success","welcome back,You are successfully logged in");
    let redirectLink=res.locals.redirectUrl ||"/listings";
    
        res.redirect(redirectLink);

       
}
module.exports.renderLogin=(req,res)=>{
    res.render("./user/login.ejs")
}