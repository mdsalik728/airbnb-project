const mongoose=require("mongoose");
const initData= require("./initdata.js");
const Listing=require("../models/listing.js");

main()
.then((res)=>{
console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
  
};

const initdb= async()=>{
 await Listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"6804b9e027cdc80560d32467",
 }));
 await Listing.insertMany(initData.data);
 console.log("data was initialised");
}
initdb();