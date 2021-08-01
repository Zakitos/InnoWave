const mongoose = require('mongoose')

const spotlist_schema = mongoose.Schema({
    Spotname : {type:String,required:true}, 
    City : {type:String, required:true}, 
    Latitude : {type: Number, required:true}, 
    Longitude : {type: Number, required:true}, 
    Orientation : {type: Number, required:true}
});

module.exports = mongoose.model('spot', spotlist_schema)