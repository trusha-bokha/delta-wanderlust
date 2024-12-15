const Listing = require("../models/listing");
const mongoose = require("mongoose");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient =  mbxGeocoding({ accessToken: mapToken });
const ObjectId = mongoose.Types.ObjectId;

module.exports.index= async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
    console.log("lala",req.user);
    res.render("listings/new.ejs");
};

module.exports.renderAboutus = (req,res)=>{
    console.log("about us");
    res.render("listings/aboutus.ejs");
};



module.exports.rendercontact = (req,res)=>{
    console.log("contact");
    res.render("listings/contact.ejs");
    const { name, email, message } = req.body;
    console.log('Form submitted:', { name, email, message });
    res.redirect("/listings");
    res.send('Thank you for contacting us!');
};

module.exports.showListing = async (req,res) => {
    let {id} =req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
     req.flash("error", "Listing you requested for does not exist!");
     res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
 };

 module.exports.createListing = async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
       
    let url= req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    //console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image= {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
       }
     let originalImageUrl =  listing.image.url;
     originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let{id} =req.params;
     let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});

     if(typeof req.file !== "undefined"){
     let url= req.file.path;
     let filename = req.file.filename;
     listing.image ={url,filename};
     await listing.save();
     }
     req.flash("success", "Listing updated!");
     res.redirect(`/listings/${id}`);
};

module.exports.renderCategoryPage=async(req,res)=>{
    let {category} =req.params;
    console.log("category",category )
    const allListings = await Listing.find({ category: { $regex: new RegExp(category, "i") } });
    if (allListings.length) {
        return res.render('listings/search', { allListings: allListings, category: category });
    }
    
    //res.render('listings/search', { allListings: allListings, category: category });
};

module.exports.destroyListing = async (req,res)=>{
    let{id} =req.params;
    let deleteListing =await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", " Listing deleted!");
    res.redirect("/listings");
};