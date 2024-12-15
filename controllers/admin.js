//const admin = require("../models/admin");


const Admin = require('../models/Admin');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

// Admin login logic
/*exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
    res.render("listings/login.ejs");
};

// Create default admin
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        let admin = await Admin.findOne({ username });

        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        admin = new Admin({ username:"admin", password :1234});
        await admin.save();

        res.status(201).json({ msg: 'Admin created successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
   res.render("listings/login.ejs");
};*/


// Admin credentials
const adminUsername = 'admin';
const adminPassword = '1234';

exports.createlogin=async (req, res) => {
//if (req.session.loggedIn) {
    //res.send('You are already logged in.');
//} else {
  res.render("admin/admincreate.ejs");

  
}
//};``
// Route to display login form
exports.adminLogin =async (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
        req.session.loggedIn = true;
        res.send('Login successful! Welcome Admin.');
    } else {
        res.send('Invalid username and password. Try again.');
    }
    res.render("listings/index.ejs");
};


exports.createdashboard=async(req,res)=>{
        res.json({ msg: 'Welcome to the Admin Dashboard' });
}
