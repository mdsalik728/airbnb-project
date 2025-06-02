if(process.env.NODE_ENV !="production"){
require("dotenv").config();

}


const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js")
const {listingSchema,reviewSchema}= require("./listingSchema.js");
const listingsRouter= require('./routes/listing.js');
const reviewsRouter=require('./routes/review.js')
const User=require("./models/user.js");
const UserRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const multer=require("multer");



app.listen(process.env.PORT,(req,res)=>{
 console.log("server is working");
 });


  const dbUrl=process.env.ATLAS_dbURL;
 
main()
.then((res)=>{
console.log("connection successful");
})
.catch(err => console.log(err));


async function main() {
    await mongoose.connect(dbUrl);
  
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public" )));
app.set('trust proxy',1);


const store=MongoStore.create({ 
    mongoUrl: dbUrl,

const store=MongoStore.create({ mongoUrl: dbUrl,

        secret:process.env.SECRET,
    
    touchAfter: 24*60*60

 });
 store.on("error",()=>{
    console.log("error occured",err);
 })

const sessionOptions={

    store:store,

  store:store,

    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 *1000*60*60,
        maxAge:7 * 24 *60*60 * 1000,
    }
};

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
app.get("/demoUser",async(req,res)=>{
    let fakeUser= new User({
        email:"abcd@gmail.com",
        username:"ab-user",
    });
    let registered= await User.register(fakeUser,"Mdsalik");
    console.log(registered);
})


app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/',UserRouter);



   
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"ooopsss! Page not found"));
   });  
   
app.use((err,req,res,next)=>{
      let{statusCode=500,message="something went wrong"}=err;
      req.flash("failure",message);


      res.redirect("/listings");
      
    });

    
