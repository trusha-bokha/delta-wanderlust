const mongoose = require("mongoose");
const review = require("./review.js");
const { types } = require("joi");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type:String,
    enum: ["trending", "Rooms", "Iconic Cities", "Beach", "Castles", "Amazing Pools", "camping", "farms", "arctic", "domes"],
    // required: true,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry:{type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    //required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  },
}); 


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
  };
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


