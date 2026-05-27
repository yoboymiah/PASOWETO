const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Email is required"],
        trim: true,
        lowercase: true // Automatically converts emails to lowercase to prevent duplicates (e.g., John@Test.com vs john@test.com)
    },
    password : {
        type: String,
        required: [true, "Password is required"]
    },
    profilePic : {
        type: String,
        default: ""
    },
    role : {
        type: String,
        enum: ["GENERAL", "ADMIN"], // Restricts values to only these roles for security
        default: "GENERAL" // 🌟 CHANGED FROM ADMIN TO GENERAL FOR SAFETY!
    },
},{
    timestamps : true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel