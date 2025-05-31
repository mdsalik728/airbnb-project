const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}= require("./listingSchema.js");


module.exports.isLoggedIn=(req,res,next)=>{
  
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("failure","You must be logged in !!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){

  res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async (req,res,next)=>{
  let{id}=req.params;
  let listings= await Listing.findById(id);
  if(res.locals.currUser && !res.locals.currUser._id.equals(listings.owner._id)){
    req.flash("error","You dont have proper permissions for this");
   return res.redirect(`/listings/${id}`)
  };
  next();
};

module.exports.schemaValidate=(req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
 
 if(error){
  let errmsg= error.details.map((el)=>el.message).join(",");
  throw new ExpressError(400,error);
 }else{
  next();
 }

 };

 module.exports.RschemaValidate=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
 
 if(error){
  let errmsg= error.details.map((el)=>el.message).join(",");
  throw new ExpressError(400,error);
 }else{
  next();
 }

 };
 module.exports.isAuthor=async (req,res,next)=>{
  let{id,reviewId}=req.params;
  let reviews= await Review.findById(reviewId);
  if(res.locals.currUser && !res.locals.currUser._id.equals(reviews.author._id)){
    req.flash("error","You dont have proper permissions for this");
   return res.redirect(`/listings/${id}`);
  };
  next();
};


