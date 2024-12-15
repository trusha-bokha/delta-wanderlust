if(process.env.NODE_ENV !="producation"){
    require('dotenv').config();
}
//console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js");
//const Review = require("./models/review.js");
const session= require("express-session");
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local").Strategy;
const bodyParser = require('body-parser');
const User = require("./models/user.js");
const { isLoggedIn } =require("./middleware.js");
const ObjectId = mongoose.Types.ObjectId;
const dotenv = require('dotenv');


const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js");
const adminRoutes =require("./routes/admin.js");

//const { error } = require("console");
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() =>{
    console.log("connected DB");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//app.use("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
dotenv.config();

const sessionOptions={
    secret:"mysupersecretscore",
    resave:false,
    saveUninitialized:true,
    cookie:{
        name:"token",
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

/*app.get("/",(req,res) =>{
    res.send("hi my name trusha");
});*/


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(req.user);
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use("/admin", adminRoutes);

/*app.get("/demouser",(async(req,res)=>{
    let fakeUser= new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let newUser= await User.register(fakeUser,"helloworld");
    res.send(newUser);
}))*/



/*app.get("/testListing",async (req,res) =>{
    let sampleListing = new Listing({
        title:"my new villa",
        description:"by the beach",
        price:1200,
        location:"calangute,goa",
        country:"india",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});
*/
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found")); 
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    next();
    //res.status(statusCode).send(message);
});

app.listen(4000,() =>{
    console.log("server is listening to port :8080");
});

