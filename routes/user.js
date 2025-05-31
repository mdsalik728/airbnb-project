const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js")
const User=require("../models/user.js");
const passport=require("passport");
const flash= require("connect-flash");
const {isLoggedIn}=require("../middleware.js")
const {saveRedirectUrl}=require("../middleware.js");

const controller=require("../controllers/user.js")



//signup

router.route("/signup")
.get(controller.renderSignup)
.post(saveRedirectUrl,wrapAsync(controller.signup));




//login

router.route("/login")
.post(saveRedirectUrl,passport.authenticate(
    "local",{
        
        failureRedirect:"/login",
        failureFlash: true,
        
    }
),controller.login)
.get(controller.renderLogin);



//logout
router.get("/logout",(req,res,next)=>{

    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are succesfully logged out!! ");
        res.redirect("/listings");
    });
});






module.exports=router;