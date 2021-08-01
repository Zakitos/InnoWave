function get_distance(latA,longA,latB,longB){
    
    const r = 6378.137
    dLon = toRad(longB-longA)
    
    latA = toRad(latA)
    latB = toRad(latB)
    longA = toRad(longA)
    longB = toRad(longB)
    
    coslat = Math.cos(latA)*Math.cos(latB)*Math.cos(dLon)
    sinlat = Math.sin(latA)*Math.sin(latB)

    distance = r * Math.acos(sinlat+coslat)
    distance = Math.round(distance*10)/10
    
    return distance;
    
}

function toRad(Value){
    return Value * Math.PI / 180
}


function sort_distance_array(property){
    return function(a,b){
        if(a[property] > b[property])  
         return 1;  
        else if(a[property] < b[property])  
         return -1;  
    return 0;
    }
}

// Algorithm Function - Return a score over ten


// Règles: 
// - swellHeight: en dessous de 0.5 ça vaut rien. Le top c'est 1.5. Au delà de 2.5 = tempête donc 0
// - swellPeriod: en dessous de 8 ça vaut rien. Le top c'est 15. Au delà de 20 ??
// - swellDirection: on connait pas l'orientation de la plage donc ça vat rien
// - windDirection: on connait pas l'orientation de la plage donc ça vat rien
//     Propostion: prendre l'angle relatif entre swellDirection et windirection: si parfaitement oposé (=180°) max de points
//     si même direction = 0 
// - windSpeed: de 0 à 10 noeuds max de points après ça décroit rapidement
//     Proposition: calculcer le score de windspeed en prenant en compte l'angle relatif en swelle et wind...
// - gust: de 0 à 10 noeuds max de points après ça décroit rapidement

// Proposition de modèle: on fait une note sur 10 au total avec les coefficients suivants:

// Swell Height = de 0 à 3 points 
// Swell Period = de 0 à 3 points
// wind speed   = de 0 à 3 points multiplié par la direction relative: si 180 := 1 si  0 := 0 
// gust         =  de 0 à 1 point
// Proposition de fonctions: 
// Swell Height : fonction gaussienne centrée en 1.5 avec 0.5 et 2.5 en limite 
// Swell Period: tangente hyperbloique = 3/(1+exp(-2*(x-10)) = période de 10 donne 1.5 point et à partir de 15 de période
// on a le max de points (ici 3)

// score de 0 a 3 
function swellHeightScore(swellHeight){
    if (swellHeight < 0.5){
        swellHeightScore = 0
    }
    else if (0.5 < swellHeight <= 1){
        swellHeightScore=4*swellHeight-2
    }
    else if(1 <= swellHeight <= 1.5){
        swellHeightScore=2*swellHeight
    }       
    else if(1.5 <= swellHeight <=2.5){
        swellHeightScore=3
    }
    else{
        swellScore = -1
    }
    return swellHeightScore
} 
// return value between 0 and 3 
function swellPeriodScore(swellPeriod){
    swellPeriodScore = (Math.atan(swellPeriod-10.5)+1.58)/1.58*1.5
    return swellPeriodScore
} 

// return value between 0 and 3     
function windSpeedScore(windSpeed){
    windSpeed=(0.5144*windSpeed)/3.6
    windSpeedScore = (Math.atan(0.5*(-windSpeed+13))+1.58)/1.58*1.5
    return windSpeedScore   
}

// score between 0 and 1 
function gustSpeedScore(gustSpeed){
    gustSpeed = 1.945*gustSpeed //Conversion m.s-1 vers noeuds
    gustSpeedScore = (Math.atan(0.5*(-gustSpeed+13))+1.58)/1.58*0.5
    return gustSpeedScore
} 

function windDirectionScore(windDirection,spotLabel){
    windLabel = convertDirectionToLabelFunction(windDirection)
    if (Math.abs(windLabel - spotLabel)==3){
        windDirectionScore = 1 
    } //Si vent opposé à orientation (vent de terre) alors c'est bon 
    else{
        windDirectionScore = 0
    }
    return windDirectionScore
}

function swellDirectionScore(swellDirection,spotLabel){
    swellLabel = convertDirectionToLabelFunction(swellDirection)
    if (swellLabel == spotLabel){
        swellDirectionScore = 0.5
    }else{
        swellDirectionScore = 0
    }
    return swellDirectionScore
}

function convertDirectionToLabelFunction(direction){
    if (direction<=60){
        return 4
    }else if(direction <= 120){
        return 5
    }else if(direction <= 180){
        return 6
    }else if(direction <= 240){
        return 1
    }else if(direction <= 300){
        return 2
    }else if(direction <= 360){
        return 3
    }     
}

// Database function    
function get_score_algo(swellHeight,swellPeriod,windSpeed,gustSpeed,windDirection,swellDirection,spot_orientation){
    result = this.swellHeightScore(swellHeight) + 
    this.swellPeriodScore(swellPeriod) + 
    this.windSpeedScore(windSpeed) + 
    this.gustSpeedScore(gustSpeed) +
    this.windDirectionScore(windDirection,spot_orientation) + 
    this.swellDirectionScore(swellDirection,spot_orientation)
    result = ((result /30)*100).toFixed(2)
    //console.log("SH : ",swellHeight, "SP :", swellPeriod, "GS : ",gustSpeed, "WD :", windDirection, "SD :", swellDirection, "SO :", spot_orientation)
    //console.log("RESULT : ",result)
    return result
}

module.exports = {get_distance,sort_distance_array,get_score_algo,swellHeightScore,swellPeriodScore,windSpeedScore,gustSpeedScore,swellDirectionScore,windDirectionScore};
