const mongoose = require('mongoose')
const fetch = require('sync-fetch')
const fs = require('fs')
mongoose.connect('mongodb://localhost:27017/innowave', 
    {useNewUrlParser:true,useUnifiedTopology: true}
    ).catch(error => console.log(error));

const spotlist = require('../models/spotlist');
const weather_scheme = require('../models/weather');
const utils = require('./load_models');


const API_STORMGLASS_PREMIUM = '9ee7f2e8-29dc-11eb-a5a9-0242ac130002-9ee7f360-29dc-11eb-a5a9-0242ac130002'


const HOURS_NUMBER = 24
var date
var count_days = 0 
var flag = 0

function load_database(){
    console.log('REMOVING COLLECTION')
    weather_scheme.remove({}, function(err) { 
        if (err){
            console.log('An error occurs ...')
            console.log(err)
        }
        console.log('Collection removed') 
    }).then(() => {
            spotlist.find({},'Spotname Longitude Latitude', function(err,data){
            if (err){

                console.log('An error occurs ...')
                console.log(err)

            }else{

                var date = new Date()
                date.setDate(date.getDate() + 5);
                date_7days = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' 23:00'
                for(w=0;w<data.length;w++){
                    try {  
                        const url = new URL('https://api.stormglass.io/v2/weather/point')
                        url.searchParams.set('lat',data[w].Latitude)
                        url.searchParams.set('lng',data[w].Longitude)
                        url.searchParams.set('params','airTemperature,cloudCover,currentDirection,currentSpeed,gust,precipitation,seaLevel,swellDirection,swellHeight,swellPeriod,visibility,waterTemperature,waveDirection,waveHeight,wavePeriod,windWaveDirection,windWaveHeight,windWavePeriod,windDirection,windSpeed')
                        url.searchParams.set('end',date_7days)
                        console.log("Get Data :")
                        console.log("SPOT : ", data[w].Spotname)
                        const metadata = fetch(url.href,{
                                headers : {
                                'Authorization': API_STORMGLASS_PREMIUM
                                }
                            }).json()
                        for(i=0;i<metadata.hours.length;i++){
                                // if i reach a new day we reset count_hours
                        
                                if (i==0){
                                    count_days = 0
                                    date = new Date()
                                    date.setDate(date.getDate() + count_days);
                                    date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
                                    weather = utils.create_new_weather_scheme(data[w]._id,date)
                                    flag=1
                                }
                                
                                //console.log(metadata.hours[0].currentDirection)
                                if ((i%HOURS_NUMBER==0)&&(i!=0)){
                                    count_days = count_days + 1
                                    date = new Date()
                                    date.setDate(date.getDate() + count_days);
                                    date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
                                    weather = utils.push_data_on_scheme(weather,date)  
                                }   
                                
                                if (metadata.hours[i].airTemperature.dwd != undefined){
                                    weather.data[count_days].airTemperature.data_dwd.push(metadata.hours[i].airTemperature.dwd) 
                                }
                                if (metadata.hours[i].airTemperature.noaa != undefined){
                                    weather.data[count_days].airTemperature.data_noaa.push(metadata.hours[i].airTemperature.noaa)
                                }
                                if (metadata.hours[i].airTemperature.sg != undefined){
                                    weather.data[count_days].airTemperature.data_sg.push(metadata.hours[i].airTemperature.sg)
                                }

                                if (metadata.hours[i].cloudCover.dwd != undefined){
                                    weather.data[count_days].cloudCover.data_dwd.push(metadata.hours[i].cloudCover.dwd) 
                                }
                                if (metadata.hours[i].cloudCover.noaa != undefined){
                                    weather.data[count_days].cloudCover.data_noaa.push(metadata.hours[i].cloudCover.noaa)
                                }
                                if (metadata.hours[i].cloudCover.sg != undefined){
                                    weather.data[count_days].cloudCover.data_sg.push(metadata.hours[i].cloudCover.sg)
                                }

                                if (metadata.hours[i].currentDirection.meto != undefined){
                                    weather.data[count_days].currentDirection.data_meto.push(metadata.hours[i].currentDirection.meto) 
                                }
                                if (metadata.hours[i].currentDirection.sg != undefined){
                                    weather.data[count_days].currentDirection.data_sg.push(metadata.hours[i].currentDirection.sg)
                                }
                                
                                if (metadata.hours[i].currentSpeed.meto != undefined){
                                    weather.data[count_days].currentSpeed.data_meto.push(metadata.hours[i].currentSpeed.meto) 
                                }
                                if (metadata.hours[i].currentSpeed.sg != undefined){
                                    weather.data[count_days].currentSpeed.data_sg.push(metadata.hours[i].currentSpeed.sg)
                                }

                                if (metadata.hours[i].gust.dwd != undefined){
                                    weather.data[count_days].gust.data_dwd.push(metadata.hours[i].gust.dwd) 
                                }
                                if (metadata.hours[i].gust.noaa != undefined){
                                    weather.data[count_days].gust.data_noaa.push(metadata.hours[i].gust.noaa)
                                }
                                if (metadata.hours[i].gust.sg != undefined){
                                    weather.data[count_days].gust.data_sg.push(metadata.hours[i].gust.sg)
                                }

                                if (metadata.hours[i].seaLevel.meto != undefined){
                                    weather.data[count_days].seaLevel.data_meto.push(metadata.hours[i].seaLevel.meto) 
                                }
                                if (metadata.hours[i].seaLevel.sg != undefined){
                                    weather.data[count_days].seaLevel.data_sg.push(metadata.hours[i].seaLevel.sg)
                                }
                                
                                if (metadata.hours[i].swellDirection.dwd != undefined){
                                    weather.data[count_days].swellDirection.data_dwd.push(metadata.hours[i].swellDirection.dwd) 
                                }
                                if (metadata.hours[i].swellDirection.icon != undefined){
                                    weather.data[count_days].swellDirection.data_icon.push(metadata.hours[i].swellDirection.icon)
                                }
                                if (metadata.hours[i].swellDirection.meteo != undefined){
                                    weather.data[count_days].swellDirection.data_meteo.push(metadata.hours[i].swellDirection.meteo) 
                                }
                                if (metadata.hours[i].swellDirection.noaa != undefined){
                                    weather.data[count_days].swellDirection.data_noaa.push(metadata.hours[i].swellDirection.noaa)
                                }
                                if (metadata.hours[i].swellDirection.sg != undefined){
                                    weather.data[count_days].swellDirection.data_sg.push(metadata.hours[i].swellDirection.sg)
                                }

                                if (metadata.hours[i].swellHeight.dwd != undefined){
                                    weather.data[count_days].swellHeight.data_dwd.push(metadata.hours[i].swellHeight.dwd) 
                                }
                                if (metadata.hours[i].swellHeight.icon != undefined){
                                    weather.data[count_days].swellHeight.data_icon.push(metadata.hours[i].swellHeight.icon)
                                }
                                if (metadata.hours[i].swellHeight.dmeteo != undefined){
                                    weather.data[count_days].swellHeight.data_meteo.push(metadata.hours[i].swellHeight.meteo) 
                                }
                                if (metadata.hours[i].swellHeight.noaa != undefined){
                                    weather.data[count_days].swellHeight.data_noaa.push(metadata.hours[i].swellHeight.noaa)
                                }
                                if (metadata.hours[i].swellHeight.sg != undefined){
                                    weather.data[count_days].swellHeight.data_sg.push(metadata.hours[i].swellHeight.sg)
                                }

                                if (metadata.hours[i].swellPeriod.dwd != undefined){
                                    weather.data[count_days].swellPeriod.data_dwd.push(metadata.hours[i].swellPeriod.dwd) 
                                }
                                if (metadata.hours[i].swellPeriod.icon != undefined){
                                    weather.data[count_days].swellPeriod.data_icon.push(metadata.hours[i].swellPeriod.icon)
                                }
                                if (metadata.hours[i].swellPeriod.meteo != undefined){
                                    weather.data[count_days].swellPeriod.data_meteo.push(metadata.hours[i].swellPeriod.meteo) 
                                }
                                if (metadata.hours[i].swellPeriod.noaa != undefined){
                                    weather.data[count_days].swellPeriod.data_noaa.push(metadata.hours[i].swellPeriod.noaa)
                                }
                                if (metadata.hours[i].swellPeriod.sg != undefined){
                                    weather.data[count_days].swellPeriod.data_sg.push(metadata.hours[i].swellPeriod.sg)
                                }

                                if (metadata.hours[i].visibility.noaa != undefined){
                                    weather.data[count_days].visibility.data_noaa.push(metadata.hours[i].visibility.noaa)
                                }
                                if (metadata.hours[i].visibility.sg != undefined){
                                    weather.data[count_days].visibility.data_sg.push(metadata.hours[i].visibility.sg)
                                }

                                if (metadata.hours[i].waterTemperature.meto != undefined){
                                    weather.data[count_days].waterTemperature.data_meto.push(metadata.hours[i].waterTemperature.meto) 
                                }
                                if (metadata.hours[i].waterTemperature.noaa != undefined){
                                    weather.data[count_days].waterTemperature.data_noaa.push(metadata.hours[i].waterTemperature.noaa)
                                }
                                if (metadata.hours[i].waterTemperature.sg != undefined){
                                    weather.data[count_days].waterTemperature.data_sg.push(metadata.hours[i].waterTemperature.sg)
                                }

                                if (metadata.hours[i].waveDirection.icon != undefined){
                                    weather.data[count_days].waveDirection.data_icon.push(metadata.hours[i].waveDirection.icon) 
                                }
                                if (metadata.hours[i].waveDirection.meteo != undefined){
                                    weather.data[count_days].waveDirection.data_meteo.push(metadata.hours[i].waveDirection.meteo) 
                                }
                                if (metadata.hours[i].waveDirection.noaa != undefined){
                                    weather.data[count_days].waveDirection.data_noaa.push(metadata.hours[i].waveDirection.noaa)
                                }
                                if (metadata.hours[i].waveDirection.sg != undefined){
                                    weather.data[count_days].waveDirection.data_sg.push(metadata.hours[i].waveDirection.sg)
                                }

                                if (metadata.hours[i].waveHeight.dwd != undefined){
                                    weather.data[count_days].waveHeight.data_dwd.push(metadata.hours[i].waveHeight.dwd) 
                                }
                                if (metadata.hours[i].waveHeight.icon != undefined){
                                    weather.data[count_days].waveHeight.data_icon.push(metadata.hours[i].waveHeight.icon) 
                                }
                                if (metadata.hours[i].waveHeight.meteo != undefined){
                                    weather.data[count_days].waveHeight.data_meteo.push(metadata.hours[i].waveHeight.meteo) 
                                }
                                if (metadata.hours[i].waveHeight.noaa != undefined){
                                    weather.data[count_days].waveHeight.data_noaa.push(metadata.hours[i].waveHeight.noaa)
                                }
                                if (metadata.hours[i].waveHeight.sg != undefined){
                                    weather.data[count_days].waveHeight.data_sg.push(metadata.hours[i].waveHeight.sg)
                                }

                                if (metadata.hours[i].wavePeriod.icon != undefined){
                                    weather.data[count_days].wavePeriod.data_icon.push(metadata.hours[i].wavePeriod.icon) 
                                }
                                if (metadata.hours[i].wavePeriod.meteo != undefined){
                                    weather.data[count_days].wavePeriod.data_meteo.push(metadata.hours[i].wavePeriod.meteo) 
                                }
                                if (metadata.hours[i].wavePeriod.noaa != undefined){
                                    weather.data[count_days].wavePeriod.data_noaa.push(metadata.hours[i].wavePeriod.noaa)
                                }
                                if (metadata.hours[i].wavePeriod.sg != undefined){
                                    weather.data[count_days].wavePeriod.data_sg.push(metadata.hours[i].wavePeriod.sg)
                                }

                                if (metadata.hours[i].windDirection.icon != undefined){
                                    weather.data[count_days].windDirection.data_icon.push(metadata.hours[i].windDirection.icon) 
                                }
                                if (metadata.hours[i].windDirection.noaa != undefined){
                                    weather.data[count_days].windDirection.data_noaa.push(metadata.hours[i].windDirection.noaa)
                                }
                                if (metadata.hours[i].windDirection.sg != undefined){
                                    weather.data[count_days].windDirection.data_sg.push(metadata.hours[i].windDirection.sg)
                                }

                                if (metadata.hours[i].windSpeed.icon != undefined){
                                    weather.data[count_days].windSpeed.data_icon.push((metadata.hours[i].windSpeed.icon*3.6).toFixed(2)) 
                                }
                                if (metadata.hours[i].windSpeed.noaa != undefined){
                                    weather.data[count_days].windSpeed.data_noaa.push((metadata.hours[i].windSpeed.noaa*3.6).toFixed(2))
                                }
                                if (metadata.hours[i].windSpeed.sg != undefined){
                                    weather.data[count_days].windSpeed.data_sg.push((metadata.hours[i].windSpeed.sg*3.6).toFixed(2))
                                }
                                
                                if (metadata.hours[i].windWaveDirection.dwd != undefined){
                                    weather.data[count_days].windWaveDirection.data_dwd.push(metadata.hours[i].windWaveDirection.dwd) 
                                }
                                if (metadata.hours[i].windWaveDirection.icon != undefined){
                                    weather.data[count_days].windWaveDirection.data_icon.push(metadata.hours[i].windWaveDirection.icon) 
                                }
                                if (metadata.hours[i].windWaveDirection.meteo != undefined){
                                    weather.data[count_days].windWaveDirection.data_meteo.push(metadata.hours[i].windWaveDirection.meteo) 
                                }
                                if (metadata.hours[i].windWaveDirection.noaa != undefined){
                                    weather.data[count_days].windWaveDirection.data_noaa.push(metadata.hours[i].windWaveDirection.noaa)
                                }
                                if (metadata.hours[i].windWaveDirection.sg != undefined){
                                    weather.data[count_days].windWaveDirection.data_sg.push(metadata.hours[i].windWaveDirection.sg)
                                }

                                if (metadata.hours[i].windWaveHeight.dwd != undefined){
                                    weather.data[count_days].windWaveHeight.data_dwd.push(metadata.hours[i].windWaveHeight.dwd) 
                                }
                                if (metadata.hours[i].windWaveHeight.icon != undefined){
                                    weather.data[count_days].windWaveHeight.data_icon.push(metadata.hours[i].windWaveHeight.icon) 
                                }
                                if (metadata.hours[i].windWaveHeight.meteo != undefined){
                                    weather.data[count_days].windWaveHeight.data_meteo.push(metadata.hours[i].windWaveHeight.meteo) 
                                }
                                if (metadata.hours[i].windWaveHeight.noaa != undefined){
                                    weather.data[count_days].windWaveHeight.data_noaa.push(metadata.hours[i].windWaveHeight.noaa)
                                }
                                if (metadata.hours[i].windWaveHeight.sg != undefined){
                                    weather.data[count_days].windWaveHeight.data_sg.push(metadata.hours[i].windWaveHeight.sg)
                                }

                                if (metadata.hours[i].windWavePeriod.dwd != undefined){
                                    weather.data[count_days].windWavePeriod.data_dwd.push(metadata.hours[i].windWavePeriod.dwd) 
                                }
                                if (metadata.hours[i].windWavePeriod.icon != undefined){
                                    weather.data[count_days].windWavePeriod.data_icon.push(metadata.hours[i].windWavePeriod.icon) 
                                }
                                if (metadata.hours[i].windWavePeriod.meteo != undefined){
                                    weather.data[count_days].windWavePeriod.data_meteo.push(metadata.hours[i].windWavePeriod.meteo) 
                                }
                                if (metadata.hours[i].windWavePeriod.noaa != undefined){
                                    weather.data[count_days].windWavePeriod.data_noaa.push(metadata.hours[i].windWavePeriod.noaa)
                                }
                                if (metadata.hours[i].windWavePeriod.sg != undefined){
                                    weather.data[count_days].windWavePeriod.data_sg.push(metadata.hours[i].windWavePeriod.sg)
                                }

                        } 
                        weather_scheme.create(weather,function(error, result) {
                            if (error) {
                                console.log(error)
                            };
                        });
                        
                    }catch(error){
                        console.log(error)
                        break
                    }
                    
                }
                console.log('PROCESS END')
            }
        });
    })
}

load_database()
