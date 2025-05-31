const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");


const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {isLoggedIn,schemaValidate}=require("../middleware.js");
const {isOwner}=require("../middleware.js")
const controller=require("../controllers/listing.js");


const multer=require("multer");

const {cloudinary,storage}=require('../cloudConfig.js');
const upload=multer({storage});

 //new route
 router.get("/neww",isLoggedIn,controller.renderNewForm);

 //router.route
router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]")
,schemaValidate
,wrapAsync(controller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(controller.destroyListing));


   //index route
 router.get("",wrapAsync(controller.index));

 
 //category route
 router.get("/search/trending",wrapAsync(controller.trending))
 router.get("/search/rooms",wrapAsync(controller.rooms))
 router.get("/search/farms",wrapAsync(controller.farms))
 router.get("/search/iconicCities",wrapAsync(controller.iconicCities))
 router.get("/search/mountains",wrapAsync(controller.mountains))
 router.get("/search/arctic",wrapAsync(controller.arctic))
 router.get("/search/castles",wrapAsync(controller.castles))
 router.get("/search/amazingPools",wrapAsync(controller.amazingPools))
 router.get("/search/camping",wrapAsync(controller.camping))


 //show route
  router.get("/:id",wrapAsync(controller.showListings));


   //create route
   router.post("/new",
    isLoggedIn
    ,schemaValidate
    ,upload.single("listing[image]"),wrapAsync(controller.createListing)
    );
   
 

  //edit route

   router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(controller.editListing));
    

  

   module.exports=router;

   router.post("/find",wrapAsync(controller.find));