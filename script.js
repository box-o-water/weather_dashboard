// TODO: figure out how to set this up with a new key as a secret in github or something
const key = '163a9b550e5a84d073437283547bd3e1'
var searchCity = ""

var lang = 'en'
var units = 'imperial'

var searchInput = document.getElementById("search");
var submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("submit button");

    var cities = [];

    var city = {
        city: searchInput.value.trim(),
    };

    searchCity = city.city
    console.log("searchCity: ", searchCity);

    searchInput.value = "";

    cities.push(city)
    console.log("cities: ", cities);
    localStorage.setItem("cities", JSON.stringify(cities));

    renderCities();
    getCurrent();
});

// The clearHTML function clears the existing rendered city HTML in preparation to be repopulated with the new city
function clearCityHTML() {
    console.log("clearing rendered current city from HTML");

    var current = document.getElementById("current");
    current.innerHTML = "";

    var forecast = document.getElementById("forecast");
    forecast.innerHTML = "";
}

// The renderCities function renders cities from local storage to HTML list elements
function renderCities() {
    console.log("rendering cities, if any");

    var storedCities = [];

    storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {

        for (var i = 0; i < storedCities.length; i++) {

        var li = document.createElement("li");

        li.textContent = storedCities[i].city

        var ol = document.getElementById("citiesList");

        ol.appendChild(li);
        }
    }
}

function getCurrent() {
    console.log("getCurrent")

    clearCityHTML()

    var current = document.getElementById("current")

    var requestUrlCurrent= `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${key}&lang=${lang}&units=${units}`;
  
    fetch(requestUrlCurrent)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var cityName = "City: " + data.name;
            var cityTemp = "Temp: " + data.main.temp + " fahrenheit";
            var cityWind = "Wind: " + data.wind.speed + "mph";
            var cityHumidity = "Humidity: " + data.main.humidity + "%";
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            getForecast(lat, lon)

            temp = data.main.temp;

                var listItem = document.createElement("li");
                listItem.textContent = cityName;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityTemp;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityWind;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityHumidity;
                current.appendChild(listItem);

                // listItem = document.createElement("li");
                // listItem.textContent = weatherIconUrl;
                // current.appendChild(listItem);
        })
        .catch(function (error){
            console.log(error)
        })
};

function getForecast(lat, lon) {
    console.log("getForecast")

    var forecast = document.getElementById("forecast")

    var requestUrl= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=${lang}&units=${units}`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            for (var i = 0; i < 5; i++) {
                // var listItem = someArray[i].dt_txt;
                // console.log(listItem)
                var listItem = document.createElement("li");

                listItem.textContent = new Date(data.list[i].dt*1000) + " " + "temp: " + data.list[i].main.temp;

                // TODO figure out how to grab 5 days, not 5 3-hour windows
                // when have limited, use similar to convert to yyyy-mm-dd or look into using dayjs
                // var date = new Date(someArray[i].dt*1000);
                // listItem.textContent = date.toISOString().split('T')[0]

                console.log(listItem)
                forecast.appendChild(listItem);
                console.log(forecast.innerHTML)
            }
        })
        .catch(function (error){
            console.log(error)
        })
};

function init() {
    console.log("initialize app")
}

init()
