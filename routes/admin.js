/*const express = require("express");
const router =express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/")
.get( wrapAsync(listingController.renderadmin));*/


const express = require('express');
const { adminLogin, createlogin } = require('../controllers/admin');
const router = express.Router();
const listingController = require("../controllers/admin.js");
const { authAdmin} =require("../middleware.js");

// Route to create default admin
//router.post('/create', listingController.createAdmin);

// Route to login admin
router.get('/login', listingController.createlogin);
router.post('/login', listingController.adminLogin);

router.get('/dashboard', listingController.createdashboard);

module.exports = router;
