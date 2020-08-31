const api = {
    key: " dff2151ac86eaeed440db3d2f734f8d8"
}

let temperatureUnit = "C";

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true){
    let cityName;
    if (withIP) {
        const coords = await getGPSCoords();
        const json = await fetch(`https://geo.api.gouv.fr/communes?lat=${coords.latitude}&lon=${coords.longitude}`)
            .then(response => response.json())
        cityName = json[0].nom
    } else {
        cityName = document.querySelector('#cityName').textContent;
    }
    const meteo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=dff2151ac86eaeed440db3d2f734f8d8&lang=fr&units=metric`)
        .then(res => res.json())
    console.log(meteo);
    displayWeatherCurrentInfos(meteo)

 
}

function displayWeatherCurrentInfos(data){
    const cityName = data.name;
    const dateTimestamp = data.dt;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const pressure = data.main.pressure;
    const tempMax = data.main.temp_max;
    const tempMin = data.main.temp_min;
    const description = data.weather[0].description;
    const direction = data.wind.deg;

    document.querySelector('#cityName').textContent = cityName;
    document.querySelector('#humidity').textContent =
        Math.round(humidity) + '%';
    document.querySelector('#wind').textContent =
        Math.round(wind);
    document.querySelector('#sunrise').textContent = formatDate(sunrise);
    document.querySelector('#sunset').textContent = formatDate(sunset);
    document.querySelector('#pressure').textContent =
        Math.round(pressure)
    document.querySelector('#description').textContent =
        capitalize(description);
    document.querySelector('#direction').textContent =
        Math.round(direction);

    document.querySelector('#temperature').textContent = getTemperatureLabel(temperature);
    document.querySelector('#tempMax').textContent = getTemperatureLabel(tempMax);
    document.querySelector('#tempMin').textContent = getTemperatureLabel(tempMin);



    document.querySelector('#date').textContent = formatDate(dateTimestamp, true);
    backgroundChange(data.weather[0].id);
    iconChange(data.weather[0].id);
}

function getTemperatureLabel(temperature){
    if (temperatureUnit == "C"){
        return Math.round(temperature) + '°C'
    } else {
        return Math.round(temperature * 1.8 + 32) + '°F'

    }

}

document.querySelector('#unit-c').addEventListener('click', () => {
    temperatureUnit = 'C';
    main()
});

document.querySelector('#unit-f').addEventListener('click', () => {
    temperatureUnit = 'F';
    main()
});

const ville = document.querySelector('#cityName');
ville.addEventListener('click', () => {
   
});
ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        main(false);
    }
})

 const button = document.querySelector('#search');
 button.addEventListener('click', () =>{

      var input=document.getElementById('city');
      var cityName = document.getElementById('cityName')
      var city = input.value;
        cityName.textContent = city;      
      main(false);
    }); 
 
main()
function getGPSCoords(){
    return new Promise((resolve, reject) => {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        function success(pos){
            resolve(pos.coords);
        }
        function error(err){
            reject(err);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    });
}
const weatherIcons ={
    storm: "wi wi-wi-lightning",
    rain: " wi wi-rain",
    snow: "wi wi-snow",
    clear: "wi wi-day-sunny",
    clouds: "wi wi-cloud"
}

function iconChange(conditionId) {
    let conditionKey = getAppConditionKeyFromId(conditionId);
    let iconClassName = weatherIcons[conditionKey];

    const $icon = document.getElementById("condition-icon");
    $icon.className = iconClassName;
}
function backgroundChange(conditionId){
    document.body.className = getAppConditionKeyFromId(conditionId);
}

function getAppConditionKeyFromId(conditionId){
    let conditionKey = "";

    if (conditionId >= 200 && conditionId < 300){
        conditionKey = "storm"
    } else if (conditionId >= 300 && conditionId < 600){
        conditionKey = "rain"
    } else if (conditionId >= 600 && conditionId < 700){
        conditionKey = "snow"
    } else if (conditionId >= 700 && conditionId < 800){
        conditionKey = "clear"
    } else if (conditionId == 800){
        conditionKey = "clear"
    } else if (conditionId > 800){
        conditionKey = "clouds"
    }
   else if (conditionId = 1597898859){
   conditionKey ="sunrise"
   }
   else if (conditionId = 1597948290){
    conditionKey ="sunset"
    }

    return conditionKey;
}

function formatDate(dateTimestampInSeconds, bDisplayDate){ 
    var maintenant = new Date(dateTimestampInSeconds * 1000);
    var jour = maintenant.getDate().toString().padStart(2, "0");
    var mois = (maintenant.getMonth() + 1).toString().padStart(2, "0");
    var an = maintenant.getFullYear().toString().padStart(2, "0");
    var heure = maintenant.getHours().toString().padStart(2, "0");
    var minutes = maintenant.getMinutes().toString().padStart(2, "0");
    var seconds = maintenant.getSeconds().toString().padStart(2, "0");


    if (bDisplayDate) {
        return (jour + "/" + mois + "/" + an + " ")

    }
    else {
        return (heure + "h" + minutes)
    }


}

 
function initLunarPhase(){
    var $date=new Date();
    var $year=$date.getFullYear();
    var $month=$date.getMonth()+1;
    var $day=$date.getDate();
   
    document.getElementById('day').innerHTML=$day;
    if ($month<10) {
      document.getElementById('month').innerHTML='0'+$month;
    }
    else {
      document.getElementById('month').innerHTML=$month;
    }
    document.getElementById('year').innerHTML=$year;
    
    var $moonPhase=moonPhase($year,$month,$day);
    drawMoon($moonPhase-1);
  }
  
  
   
  function moonPhase(year,month,day) {
    n = Math.floor(12.37 * (year -1900 + ((1.0 * month - 0.5)/12.0)));
    RAD = 3.14159265/180.0;
    t = n / 1236.85;
      t2 = t * t;
      as = 359.2242 + 29.105356 * n;
      am = 306.0253 + 385.816918 * n + 0.010730 * t2;
      xtra = 0.75933 + 1.53058868 * n + ((1.178e-4) - (1.55e-7) * t) * t2;
      xtra += (0.1734 - 3.93e-4 * t) * Math.sin(RAD * as) - 0.4068 * Math.sin(RAD * am);
      i = (xtra > 0.0 ? Math.floor(xtra) :  Math.ceil(xtra - 1.0));
      j1 = julday(year,month,day);
      jd = (2415020 + 28 * n) + i;
      return (j1-jd + 30)%30;
  }
  
 
  function julday(year, month, day) {
      if (year < 0) { year ++; }
      var jy = parseInt(year);
      var jm = parseInt(month) +1;
      if (month <= 2) {jy--;	jm += 12;	} 
      var jul = Math.floor(365.25 *jy) + Math.floor(30.6001 * jm) + parseInt(day) + 1720995;
      if (day+31*(month+12*year) >= (15+31*(10+12*1582))) {
          ja = Math.floor(0.01 * jy);
          jul = jul + 2 - ja + Math.floor(0.25 * ja);
      }
      return jul;
  }
  
   
  function drawMoon($moonPhase){
    var $moonCanvas=document.getElementById('moonCanvas');
    var $ctx=$moonCanvas.getContext('2d');
    
    var fadeColor = "#3b409769";
     
    var $radius=100;
    var $centerX=$moonCanvas.width/2;
    var $centerY=$moonCanvas.height/2;
    var $moonFill=$ctx.createRadialGradient($centerX, $centerY, $radius, $centerX, $centerY, 90);
    $moonFill.addColorStop(0,   fadeColor);
    $moonFill.addColorStop(1, 'white');
    
    $ctx.beginPath();
    $ctx.arc($centerX,$centerY,$radius,270*(Math.PI/180),90*(Math.PI/180),($moonPhase<15)?false:true);
    $ctx.fillStyle=$moonFill;
    $ctx.fill();
    
    
    var $ovalWidth=-200;
    $ovalWidth=($moonPhase<15)?-200+$moonPhase*28.5:200-(($moonPhase-15)*28.5);
    var $ovalColor=($ovalWidth>0)? $moonFill:fadeColor;
    
    drawEllipse($ctx,$centerX-$ovalWidth/2,0,$ovalWidth,200,$ovalColor);
    function drawEllipse(ctx, x, y, w, h,fill) {
      var kappa = .5522848;
          ox = (w / 2) * kappa,  
          oy = (h / 2) * kappa,  
          xe = x + w,            
          ye = y + h,           
          xm = x + w / 2,       
          ym = y + h / 2;       
    
      ctx.beginPath();
      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      ctx.fillStyle=$ovalColor;
      ctx.fill();
    }
  } 
  
  
  initLunarPhase();

  $('#button-weather').click(function() {
    $('#conditions-infos').toggle('');
   } )
  
   $('#conditions-infos').toggle('');
   
    