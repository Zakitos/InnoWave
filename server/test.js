const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/innowave', {useNewUrlParser:true,useUnifiedTopology: true}).catch(error => console.log(error));
const spotlist = require('../models/spotlist')
const weather = require('../models/weather')
const utils = require('../utils/fonction')

id = ["5fb4395ca2233eba0da0a534",
      "5fb4395ca2233eba0da0a535",
      "5fb4395ca2233eba0da0a536",
      "5fb4395ca2233eba0da0a537"
]

async function algorithm_resolution(document){
    for(i = 0; i<id.length;i++){

        const data = await weather.find({});
        console.log(data)
        console.log(i)
    
    }
    
}
