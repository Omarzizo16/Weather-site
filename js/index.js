var app = document.querySelector('.weather-app');

//search
var form = document.getElementById('locationInput');
var search = document.querySelector('.search');
var btn = document.querySelector('.submit');
//main temp
var temp = document.querySelector('.temp');
var cityNameOutPut = document.querySelector('.city-name');
var timeOutPut = document.querySelector('.time');   
var dateOutPut = document.querySelector('.date');
var conditionOutPut = document.querySelector('.condition');
var iconOutPut = document.querySelector('.icon');

//information-details
var cloudOutPut = document.querySelector('.cloud');
var humidityOutPut = document.querySelector('.Humidity');
var windOutPut = document.querySelector('.Wind');

//next day 
var tomorrow = document.querySelector('.tomorrow');
var tomorrowCondition = document.querySelector('.tomorrowCondition');
var tomorrowIcon = document.querySelector('.tomorrow-icon');
var tomorrowMaxTemp = document.querySelector('.tomorrowMaxTemp');
var tomorrowMinTemp = document.querySelector('.tomorrowMinTemp');

//next next day
var overmorrow = document.querySelector('.overmorrow');
var overmorrowCondition = document.querySelector('.overmorrowCondition');
var overmorrowIcon = document.querySelector('.overmorrow-icon');
var overmorrowMaxTemp = document.querySelector('.overmorrowMaxTemp');
var overmorrowMinTemp = document.querySelector('.overmorrowMinTemp');



var apiKey = 'b0389af80ef84aa4a9445301243011';
var baseUrl='http://api.weatherapi.com/v1'

form.addEventListener('submit', function(event){
    event.preventDefault();
});

async function getWeather(city) {
    var weatherResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=b0389af80ef84aa4a9445301243011&q=${city}&days=3`)
    var weatherData=await weatherResponse.json();
    return weatherData;
}
function displayTodayData(data){
    var todayDate = new Date();
    dateOutPut.innerHTML=todayDate.toLocaleDateString("en-us",{weekday:"long", day:"2-digit",year:"numeric"})
    timeOutPut.innerHTML=todayDate.toLocaleTimeString("en-us",{timeStyle:"short"})
    temp.innerHTML=data.current.temp_c;
    cityNameOutPut.innerHTML=data.location.name;
    conditionOutPut.innerHTML=data.current.condition.text;
    iconOutPut.src= `https:${data.current.condition.icon}`;
    cloudOutPut.innerHTML=data.current.cloud + " oktas";
    humidityOutPut.innerHTML=data.current.humidity + " %";
    windOutPut.innerHTML=data.current.wind_kph + " Km/h";
    setBackground(data.current.condition.code, data.current.is_day);
}


function displayTomorrow(data){
    var tomorrowDate = new Date(data.forecast.forecastday[1].date)
    tomorrow.innerHTML=tomorrowDate.toLocaleDateString("en-us",{weekday:"long"})
    tomorrowMaxTemp.innerHTML=`${data.forecast.forecastday[1].day.maxtemp_c}&#176;  
    <i class="fa-solid fa-temperature-high"></i>`;
    tomorrowMinTemp.innerHTML=`${data.forecast.forecastday[1].day.mintemp_c}&#176; 
    <i class="fa-solid fa-temperature-low"></i>`;
    tomorrowCondition.innerHTML=data.forecast.forecastday[1].day.condition.text;
    tomorrowIcon.src= `https:${data.forecast.forecastday[1].day.condition.icon}`;
}

function displayOvermorrow(data){
    var overmorrowDate = new Date(data.forecast.forecastday[2].date)
    overmorrow.innerHTML=overmorrowDate.toLocaleDateString("en-us",{weekday:"long"})
    overmorrowMaxTemp.innerHTML=`${data.forecast.forecastday[2].day.maxtemp_c}&#176; 
    <i class="fa-solid fa-temperature-high"></i>`;
    overmorrowMinTemp.innerHTML=`${data.forecast.forecastday[2].day.mintemp_c}&#176; 
    <i class="fa-solid fa-temperature-low"></i>`;
    overmorrowCondition.innerHTML=data.forecast.forecastday[2].day.condition.text;
    overmorrowIcon.src = `https:${data.forecast.forecastday[2].day.condition.icon}`;
}

function setBackground(code, isDaytime) {
    var background = "";

    var clearCodes = [1000];
    var cloudsCodes = [1003, 1006, 1009, 1030];
    var rainCodes = [
        1063, 1087, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195,
        1240, 1243, 1246, 1273, 1276
    ];
    var snowCodes = [
        1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
        1255, 1258, 1279, 1282
    ];

    if (clearCodes.includes(code)) {
        background = isDaytime ? "url('./images/day/clear.jpg')" : "url('./images/night/clear.jpg')";
    } else if (cloudsCodes.includes(code)) {
        background = isDaytime ? "url('./images/day/clouds.jpg')" : "url('./images/night/claude.jpg')";
    } else if (rainCodes.includes(code)) {
        background = isDaytime ? "url('./images/day/rain.jpg')" : "url('./images/night/rain.jpg')";
    } else if (snowCodes.includes(code)) {
        background = isDaytime ? "url('./images/day/snow.jpg')" : "url('./images/night/snow.jpg')";
    } else {
        background = isDaytime ? "url('./images/day/clouds.jpg')" : "url('./images/night/clouds.jpg')";
    }
        document.body.style.backgroundImage = background;
}



search.addEventListener("input", function(){
    startApp(search.value);
})


async function startApp(city = "Giza") {
    try {
        if (typeof city === 'string' && city.includes(',')) {
            var weatherData = await getWeather(city);
        } 
        else {
            var weatherData = await getWeather(city);
        }

        if(!weatherData.error){
            displayTodayData(weatherData);
            displayTomorrow(weatherData);
            displayOvermorrow(weatherData);
        }
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        alert("An error occurred while fetching weather data.");
    }
}

document.querySelector('.location-btn').addEventListener('click', async () => {
    try {
        var location = await getCurrentLocation();
        
        await startApp(location);
    } catch (error) {
        console.error("Location Error:", error);
        alert(error);
    }
});

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    resolve(`${latitude},${longitude}`);
                },
                (error) => {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            reject("User denied location access.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject("Location information unavailable.");
                            break;
                        case error.TIMEOUT:
                            reject("Location request timed out.");
                            break;
                        default:
                            reject("Unknown location error.");
                    }
                }
            );
        } else {
            reject("Geolocation not supported by this browser.");
        }
    });
}

startApp();

