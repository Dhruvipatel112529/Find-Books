const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    User_id: {
        type : Schema.Types.ObjectId,
        primaryKey: true,
    },
    First_name: {
        type: String,
        required: true,
        trim: true, 
    },
    Last_name: {
        type: String,
        required: true,
        trim: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    Phone_no: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], 
    },
    Password: {
        type: String,
        required: true,
        minlength: 6, 
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    otp: {
        type: String
    },
    
}, { timestamps: true }); 

module.exports = mongoose.model("User", UserSchema);