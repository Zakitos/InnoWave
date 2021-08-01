const weather_scheme = require('../models/weather');
function create_new_weather_scheme(id,day){
    weather = new weather_scheme(
    {
        spot_id:id,
        data : 
        [
            
            {
                date: day,
                airTemperature : 
                    {
                        data_dwd: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                cloudCover :
                    {
                        data_dwd: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                currentDirection :
                    {
                        data_meto: [],
                        data_sg: []
                    }
                , 
                currentSpeed :
                    {
                        data_meto: [],
                        data_sg: []
                    }
                ,
                gust : 
                    {
                        data_dwd: [],
                        data_noaa: [],
                        data_sg: []
                    }
                , 
                precipitation: 
                    {
                        data_dwd: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                seaLevel:
                    {
                        data_meto: [],
                        data_sg: []
                    }
                ,
                currentSpeed :
                    {
                        data_meto: [],
                        data_sg: []
                    }
                ,
                swellDirection: 
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [],
                        data_sg: []
                    }
                , 
                swellHeight:
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,  
                swellPeriod:
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                visibility:
                    {
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                waterTemperature: 
                    {
                        data_meto: [],
                        data_noaa: [],
                        data_sg: []
                    }
                , 
                waveDirection: 
                    {
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [],
                        data_sg: []
                    }
                ,
                waveHeight: 
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                wavePeriod: 
                    {
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                windDirection:
                    {
                        data_icon: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                windSpeed:
                    {
                        data_icon: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                windWaveDirection:
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                windWaveHeight:
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                ,
                windWavePeriod:
                    {
                        data_dwd: [],
                        data_icon: [],
                        data_meteo: [],
                        data_noaa: [], 
                        data_sg: []
                    }
                        
            }
        ],        
    })
    return weather
}

function push_data_on_scheme(weather,day){
    weather.data.push({
        date: day,
        airTemperature : 
            {
                data_dwd: [],
                data_noaa: [],
                data_sg: []
            }
        ,
        cloudCover :
            {
                data_dwd: [],
                data_noaa: [],
                data_sg: []
            }
        ,
        currentDirection :
            {
                data_meto: [],
                data_sg: []
            }
        , 
        currentSpeed :
            {
                data_meto: [],
                data_sg: []
            }
        ,
        gust : 
            {
                data_dwd: [],
                data_noaa: [],
                data_sg: []
            }
        , 
        precipitation: 
            {
                data_dwd: [],
                data_noaa: [],
                data_sg: []
            }
        ,
        seaLevel:
            {
                data_meto: [],
                data_sg: []
            }
        ,
        currentSpeed :
            {
                data_meto: [],
                data_sg: []
            }
        ,
        swellDirection: 
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [],
                data_sg: []
            }
        , 
        swellHeight:
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [],
                data_sg: []
            }
        ,  
        swellPeriod:
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [],
                data_sg: []
            }
        ,
        visibility:
            {
                data_noaa: [],
                data_sg: []
            }
        ,
        waterTemperature: 
            {
                data_meto: [],
                data_noaa: [],
                data_sg: []
            }
        , 
        waveDirection:
            {
                data_icon: [],
                data_meteo: [],
                data_noaa: [],
                data_sg: []
            }
        ,
        waveHeight: 
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        wavePeriod: 
            {
                data_icon: [],
                data_meteo: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        windDirection:
            {
                data_icon: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        windSpeed:
            {
                data_icon: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        windWaveDirection:
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        windWaveHeight:
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [], 
                data_sg: []
            }
        ,
        windWavePeriod:
            {
                data_dwd: [],
                data_icon: [],
                data_meteo: [],
                data_noaa: [], 
                data_sg: []
            }
        
                
    })
    return weather;
}

exports.create_new_weather_scheme = create_new_weather_scheme
exports.push_data_on_scheme = push_data_on_scheme