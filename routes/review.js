const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {isLoggedIn,isOwner}=require("../middleware.js");

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {RschemaValidate,isAuthor}=require("../middleware.js")
const controller=require("../controllers/review.js")





//post-reviews
router.post("/", isLoggedIn,RschemaValidate,wrapAsync(controller.postReview));
  

  

   //delete review route
   router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(controller.destroyReview));
    
   module.exports=router;