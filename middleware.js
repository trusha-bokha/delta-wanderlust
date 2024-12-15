const Listing=require("./models/listing");
const Review=require("./models/review");
const admin=require("./models/Admin");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const jwt = require('jsonwebtoken');


module.exports.isLoggedIn = (req,res,next)=>{
    console.log("------",req.cookies);
    console.log(req.path);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    };
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let{id} =req.params;
     let listing = await Listing.findById(id);
    if(!res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listings ");
         return res.redirect(`/listings/${id}`);
     };
     next();
};

module.exports. validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    };
};

module.exports. validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    };
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id,reviewId} =req.params;
     let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review ");
         return res.redirect(`/listings/${id}`);
     };
     next();
};



module.exports.authAdmin = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
