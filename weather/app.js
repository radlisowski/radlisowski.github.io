//select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const feelsLikeElement = document.querySelector(".feels-like");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location");
const notificationElement = document.querySelector(".notification");

//data
const weather = {};

weather.temperature = {
    unit: "celcius"
}

weather.feelsLike = {
    
}

//const and vars
const KELVIN = 273;
const key = "538ab7e7ed448cd08865049d987acef5";

//check does the browser supports geoloation

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}
//set user position

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//show error when there is an issue with the geolocation
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`
}

//get weather from the api
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api)
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.feelsLike.value = Math.floor(data.main.feels_like - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        
    })
    .then(function(){
        displayWeather();
        updateWallpapper();
    });
}

function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    feelsLikeElement.innerHTML = `Feels like: ${weather.feelsLike.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country} `;
}

function updateWallpapper() {
    if (weather.description == 'scattered clouds') {
        document.body.style.background = "#293251 url('https://images.unsplash.com/photo-1445297983845-454043d4eef4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80') no-repeat center";
    }

    if (weather.description == 'rain') {
        document.body.style.background = "#293251 url('https://images.unsplash.com/photo-1433863448220-78aaa064ff47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80') no-repeat center";
    }
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheitTemp = celsiusToFahrenheit(weather.temperature.value);
        fahrenheitTemp = Math.floor(fahrenheitTemp);

        let farenhightFeelsLike = celsiusToFahrenheit(weather.feelsLike.value);
        farenhightFeelsLike = Math.floor(farenhightFeelsLike);

        tempElement.innerHTML = `${fahrenheitTemp}°<span>F</span>`;
        feelsLikeElement.innerHTML = `Feels like: ${farenhightFeelsLike}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        feelsLikeElement.innerHTML = `Feels like: ${weather.feelsLike.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});