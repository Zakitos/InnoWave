const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const axios = require('axios')

mongoose.connect('mongodb://localhost:27017/innowave', {useNewUrlParser:true,useUnifiedTopology: true}).catch(error => console.log(error));


const spotlist = require('../models/spotlist')
const weather = require('../models/weather')
const utils = require('../utils/fonction');
const { json } = require('body-parser');


const router = express()
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

const port = 8888
const API_KEY_GOOGLE = 'AIzaSyAZesRj8lR2CzCTxIuoyIU9JwnBzpNZ9aE'
const API_STORMGLASS_PREMIUM = '9ee7f2e8-29dc-11eb-a5a9-0242ac130002-9ee7f360-29dc-11eb-a5a9-0242ac130002'
var NOTES_GLOBAL = []

router.post('/spots', function(req,res) {

  //get the information from post method 
    console.log('Got a new message',req.body);

    var rayon = req.body.Rayon
    var latitude = req.body.Latitude
    var longitude = req.body.Longitude

  //initialise json file
    obj = [];
    info_spot = ""

  // data in database - We would like to find which spot in nearest from position 
    spotlist.find({},function(err,data){
  
      //get all distance - bird flight distance 
      for(i=0;i<data.length-1;i++){
        distance = utils.get_distance(latitude,longitude,data[i].Latitude,data[i].Longitude)
        if(rayon >= distance){
          info_spot += data[i].Latitude.toString() +"," + data[i].Longitude.toString() + "|"
          var info = {
                      "spotId" : data[i].id,
                      "spotName" : data[i].Spotname,
                      "city" : data[i].City,
                      "dist_bird" : distance,
                      "latitude" : data[i].Latitude,
                      "longitude" :  data[i].Longitude
                    }
          obj.push(info)
        }
      }
      if (obj.length > 25){ // si plus de 25 spots aux alentours on filtre les spots les plus loins 
        console.log("FILTER SPOTS -- NUMBER AVAILAIBLE IS TOO IMPORTANT : ",obj.length)
        info_spot = ""
        obj.sort(utils.sort_distance_array("dist_bird"));
        obj.length = 25
        for(i=0;i<obj.length;i++){
          info_spot += obj[i].latitude.toString() +"," + obj[i].longitude.toString() + "|"
        }
      }
      
    }).then((data)=> {

      // get the answer by google 
      axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',{
        
          params: {
            'origins': latitude.toString()+','+longitude.toString(),
            'destinations': info_spot,
            'units' : 'metrics',
            'key' : API_KEY_GOOGLE
          }
        }).then((reponse) => {
          //console.log(reponse.data)
          try {
            for (i=0; i<reponse.data.rows[0].elements.length;i++){
              obj[i]['adresse'] = reponse.data.destination_addresses[i]
              obj[i]['distance'] = reponse.data.rows[0].elements[i].distance.text
              obj[i]['distance_int'] = reponse.data.rows[0].elements[i].distance.value
              obj[i]['duration'] = reponse.data.rows[0].elements[i].duration.text
              obj[i]['duration_int'] = reponse.data.rows[0].elements[i].duration.value
            }
          }catch(error){
              obj = []
              console.log(error)
          }
        },(error) => {
          obj = []
          console.log(error);
        }
        ).then(async () => {

          obj.sort(utils.sort_distance_array("distance_int"));
          for (i=0;i<obj.length;i++){
            if (obj[i].distance_int > rayon*1000){
              obj.splice(i,1)
              i = i-1
            }
          }
          
          // define a score for algorithm
          // SwellHeigh,SwellPeriod,windSpeed,gustSpeed
          for(i = 0; i<obj.length;i++){
            //console.log(obj[i])
            //get data for specific spot id
            const weather_data = await weather.find({spot_id:obj[i].spotId},
              'data.swellHeight\
               data.swellPeriod\
               data.windSpeed\
               data.gust\
               data.windDirection\
               data.swellDirection\
              '
            );
            data = weather_data[0].data
            //console.log(data.windDirection)
            // get spot Orientation 
            spot_orientation = await spotlist.find({_id:obj[i].spotId},'Orientation');
            spot_orientation = spot_orientation[0].Orientation
            note_day = []
            note_hour = []
            for (number_day = 0 ; number_day < data.length ; number_day++){
              for(number_hour = 0; number_hour < 24; number_hour++){
                  // filter for swellHeigh : Priority noaa/meteo/dwd/icon/sg
                  swellHeight = data[number_day].swellHeight.data_noaa[number_hour]
                  if (swellHeight == undefined){
                    swellHeight = data[number_day].swellHeight.data_meteo[number_hour]
                  }
                  if (swellHeight == undefined){
                    swellHeight = data[number_day].swellHeight.data_dwd[number_hour]
                  }
                  if (swellHeight == undefined){
                    swellHeight = data[number_day].swellHeight.data_icon[number_hour]
                  }
                  if (swellHeight == undefined){
                    swellHeight = data[number_day].swellHeight.data_sg[number_hour]
                  }
                  // filter for swellPeriod : Priority noaa/meteo/dwd/icon/sg
                  swellPeriod = data[number_day].swellPeriod.data_noaa[number_hour]
                  if (swellPeriod == undefined){
                    swellPeriod = data[number_day].swellPeriod.data_meteo[number_hour]
                  }
                  if (swellPeriod == undefined){
                    swellPeriod = data[number_day].swellPeriod.data_dwd[number_hour]
                  }
                  if (swellPeriod == undefined){
                    swellPeriod = data[number_day].swellPeriod.data_icon[number_hour]
                  }
                  if (swellPeriod == undefined){
                    swellPeriod = data[number_day].swellPeriod.data_sg[number_hour]
                  }
                  // filter for WindSpeed : Priority noaa/icon/sg
                  windSpeed = data[number_day].windSpeed.data_noaa[number_hour]
                  if (windSpeed == undefined){
                    windSpeed = data[number_day].windSpeed.data_icon[number_hour]
                  }
                  if (windSpeed == undefined){
                    windSpeed = data[number_day].windSpeed.data_sg[number_hour]
                  }
                  // filter for gust : Priority noaa/dwd/sg
                  gust = data[number_day].gust.data_noaa[number_hour]
                  if (gust == undefined){
                    gust = data[number_day].gust.data_dwd[number_hour]
                  }
                  if (gust == undefined){
                    gust = data[number_day].gust.data_sg[number_hour]
                  }
                  // filter for windDirection : Priority noaa/icon/sg
                  windDirection= data[number_day].windDirection.data_noaa[number_hour]
                  if (windDirection == undefined){
                    windDirection = data[number_day].windDirection.data_icon[number_hour]
                  }
                  if (windDirection == undefined){
                    windDirection = data[number_day].windDirection.data_sg[number_hour]
                  }
                  // filter for swellDirection : Priority noaa/meteo/dwd/icon/sg
                  swellDirection = data[number_day].swellDirection.data_noaa[number_hour]
                  if (swellDirection == undefined){
                    swellDirection = data[number_day].swellDirection.data_meteo[number_hour]
                  }
                  if (swellDirection == undefined){
                    swellDirection = data[number_day].swellDirection.data_dwd[number_hour]
                  }
                  if (swellDirection == undefined){
                    swellDirection = data[number_day].swellDirection.data_icon[number_hour]
                  }
                  if (swellDirection == undefined){
                    swellDirection = data[number_day].swellDirection.data_sg[number_hour]
                  }
                //console.log(spot_orientation)
                note_hour.push(utils.get_score_algo(
                  swellHeight,
                  swellPeriod,
                  windSpeed,
                  gust, 
                  windDirection, 
                  swellDirection,
                  spot_orientation
                  )
                )
              }
              note_day.push(note_hour)
              note_hour = []
            }
            obj[i]['note'] = note_day
          }
          NOTES_GLOBAL = obj
          console.log('Proximity spots message send')
          res.json(obj)
        });
    })
});


router.get("/spots/:id_spot", function(req,res){
    console.log('New Request for spot :', req.params.id_spot)
    weather.find({"spot_id":req.params.id_spot}, function(err,data){
      if(err){
        console.log('Spot ID not available in the database')
        console.log('Msg Sent : \n []')
        res.json("[]")
      }else{
        //console.log(NOTES_GLOBAL)
        for (var i=0; i < NOTES_GLOBAL.length; i++){ 
          if (NOTES_GLOBAL[i]["spotId"] == req.params.id_spot){
            notes = NOTES_GLOBAL[i].note
            //console.log(notes)
            //data[0].data[0]['note'] = NOTES_GLOBAL[i].note
            //console.log(data[0].data)
          }
        }
        for (var i=0;i<data[0].data.length;i++){
            data[0].data[i]['note'] = notes[i]
        }
        console.log('Msg Sent for spot : ', req.params.id_spot)
        //console.log(data[0].data[0])
        res.json(data)
      }
    }) 
});

router.listen(port, () => {
    console.log(`Listening ${port}`)
})

