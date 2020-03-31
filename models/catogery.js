const mongoose = require("mongoose");

const catogerySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:32,
        unique:true,
        required:true
    }
},{timestamps:true});


module.exports = mongoose.model("Catogery", catogerySchema);