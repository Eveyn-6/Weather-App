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
        return (heure + "h" + minutes + " s " + seconds)
    }


}