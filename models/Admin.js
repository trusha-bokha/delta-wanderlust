/*const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema =new Schema({
    username:"admin",
    password:123,
});

module.exports = mongoose.model("admin",adminSchema);*/

const mongoose = require('mongoose');
const { types } = require("joi");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Define Admin schema
const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving admin to database
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare input password with stored hashed password
AdminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
