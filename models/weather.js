const mongoose = require('mongoose')

const weather_schema = mongoose.Schema({
    spot_id : {type:String,required:true},
    data : 
    [
        {
            date: String,
            airTemperature : 
                {
                    
                    data_dwd: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            cloudCover :
                {
                    data_dwd: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            currentDirection :
                {
                    data_meto: [Number],
                    data_sg: [Number]
                }
            , 
            currentSpeed :
                {
                    data_meto: [Number],
                    data_sg: [Number]
                }
            ,
            gust : 
                {
                    data_dwd: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            , 
            precipitation: 
                {
                    data_dwd: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            seaLevel:
                {
                    data_meto: [Number],
                    data_sg: [Number]
                }
            ,
            currentSpeed :
                {
                    data_meto: [Number],
                    data_sg: [Number]
                }
            ,
            swellDirection: 
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            , 
            swellHeight:
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,  
            swellPeriod:
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            visibility:
                {
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            waterTemperature: 
                {
                    data_meto: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            , 
            waveDirection: 
                {
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number],
                    data_sg: [Number]
                }
            ,
            waveHeight: 
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            wavePeriod: 
                {
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            windDirection:
                {
                    data_icon: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            windSpeed:
                {
                    data_icon: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            windWaveDirection:
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            windWaveHeight:
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                }
            ,
            windWavePeriod:
                {
                    data_dwd: [Number],
                    data_icon: [Number],
                    data_meteo: [Number],
                    data_noaa: [Number], 
                    data_sg: [Number]
                },
            note : Array          
        }
    ],
});

module.exports = mongoose.model('weather', weather_schema)