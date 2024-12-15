const express=require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
//const ExpressError =require("../utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner ,validateListing,} =require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/aboutus", wrapAsync(listingController.renderAboutus));
router.get("/contact", wrapAsync(listingController.rendercontact));
//category route
router.get("/:category", wrapAsync(listingController.renderCategoryPage));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
);


//edit routed
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


//index route
//router.get("/", wrapAsync(listingController.index));

//show route
//router.get("/:id",wrapAsync(listingController.showListing));

//create route
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//update route
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;