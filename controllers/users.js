const User = require("../models/user");
const nodemailer=require("nodemailer");
const randomstring=require("randomstring");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup =async(req,res)=>{
    try{
        let {username,email,password} =req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to wanderlust ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logout((err) => 
    {
        if (err){
         return next(err); 
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
    });
};

// module.exports.forgetpassword = async(req,res)=>{
//     try{
//         const email = req.body.email;
//         const userdata=await User.findOne({email:email});
//         if(userdata){
//              const randomString = randomstring.generate();
//              const data=await User.updateOne({email:email},{$set:{token:randomString}});
             
//              res.status(200).send({success:true,msg:"please check your inbox of mail and resend password"});
//         }else{
//             res.status(200).send({success:true,msg:"this email does not exist"});
//         }
//     }catch(e){
//         res.status(400).send({success:false,msg:e.message});
//     }
// }