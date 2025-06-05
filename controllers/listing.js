const Listing=require("../models/listing.js")
const {cloudinary,storage}=require('../cloudConfig.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async(req,res)=>{
    let allListing= await Listing.find({});
    
    res.render("./listings/index.ejs",{allListing});

    
 };

 module.exports.renderNewForm=(req,res)=>{
  
  
    if(!req.isAuthenticated()){
      req.flash("failure","you must be logged in !!");
      return res.redirect("/login");
    }
    categories=["trending","rooms","farms","iconic cities","mountains","arctic","amazing pools","camping","castles"];

    res.render("./listings/new.ejs",{categories});
  };


  module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    
    let listing;
    try{
    listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    
    }
    catch(e){
      req.flash("failure","Listing does not exist!!");
      res.redirect("/listings");

    }
    
    
    res.render("./listings/show.ejs",{listing});
  };

  module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
      query: `${req.body.listing.location},${req.body.listing.country}`,
      limit: 1
    }).send();
    
  

    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=new Listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image={url,filename};
    
    
    newlisting.category=req.body.listing.category;
   
    newlisting.geometry=response.body.features[0].geometry;
  
     await newlisting.save();
     req.flash("success","new listing created");
 
     res.redirect("/listings");
     };

     module.exports.editListing=async(req,res)=>{
        let {id}=req.params;
       
        let listing= await Listing.findById(id);
       
        if(!listing){
          req.flash("failure","Sorry, Listing does not exist ");
          res.redirect("/listings");
      
        }
        categories=["trending","rooms","farms","iconic cities","mountains","arctic","amazing pools","camping","castles"];
        originalListingUrl=listing.image.url;
        resizedUrl=originalListingUrl.replace("/upload","/upload/w_250");
        res.render("./listings/edit.ejs",{listing,resizedUrl,categories});
    
       };

       module.exports.updateListing=async(req,res)=>{
        if(!req.body.listing){
          throw new ExpressError(400,"bad  request")
         }
    
        let{id}= req.params;
        let response=await geocodingClient.forwardGeocode({
          query: `${req.body.listing.location},${req.body.listing.country}`,
          limit: 1
        }).send();
        

        let listings= await Listing.findById(id);



       
        if(res.locals.currUser && !res.locals.currUser._id.equals(listings.owner._id)){
          req.flash("error","you dont have proper permissions");
          return res.redirect(`/listings/${id}`)
        }
        listings.category=[];
        listings.category=req.body.listing.category;

       listings =await Listing.findByIdAndUpdate(id,{...req.body.listing});
       listings.geometry=response.body.features[0].geometry;
       

      if(typeof req.file !== 'undefined'){
        await deleteAsset(listings.image.filename);
       let url=req.file.path;
        let filename=req.file.filename;
       listings.image={url,filename};

      
      }
      await listings.save();


       req.flash("success",'Listing updated successfully');
        res.redirect("/listings");
       };

       module.exports.destroyListing=async(req,res)=>{
        
        
        let {id}=req.params;
        let listings= await Listing.findById(id);
        let filename=listings.image.filename;
        await deleteAsset(filename);
        if( !res.locals.currUser._id.equals(listings.owner._id) && res.locals.currUser){
          req.flash("error","you dont have proper permissions");
          return res.redirect(`/listings/${id}`)
        }
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing deleted successfully");
        res.redirect("/listings");
        
       };
       async function deleteAsset(publicId, resourceType = 'image') {
        
          const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
          
       
        
      }

      module.exports.trending=async(req,res)=>{
        let allListing= await Listing.find({
          category:"trending"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.rooms=async(req,res)=>{
        let allListing=await Listing.find({
          category:"rooms"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.farms=async(req,res)=>{
        let allListing=await Listing.find({
          category:"farms"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.iconicCities=async(req,res)=>{
        let allListing=await Listing.find({
          category:"iconic cities"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.mountains=async(req,res)=>{
        let allListing=await Listing.find({
          category:"mountains"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.arctic=async(req,res)=>{
        let allListing=await Listing.find({
          category:"arctic"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.castles=async(req,res)=>{
        let allListing=await Listing.find({
          category:"castles"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.amazingPools=async(req,res)=>{
        let allListing=await Listing.find({
          category:"amazing pools"
        });
        res.render("./listings/index.ejs",{allListing});
      }
      module.exports.camping=async(req,res)=>{
        let allListing=await Listing.find({
          category:"camping"
        });
        res.render("./listings/index.ejs",{allListing});
      }

module.exports.find=async(req,res)=>{
  let query= req.body.query;
  let regex= new RegExp(query,"i");
  
  let allListing= await Listing.find({
    $or:[
      { "title": {$regex:regex} },
      {"location":{$regex:regex}},
      {"country":{$regex:regex}},
      {"category":{$regex:regex}}
    ]
  });
 

  if(allListing.length != 0){
  res.render("./listings/index.ejs",{allListing});
  }else{
    req.flash("error","no such listing found");
    return res.redirect(`/listings`)
  }
}