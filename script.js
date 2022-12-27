// TODO: figure out how to set this up with a new key as a secret in github or something
const key = '5a295bb52d6491ec7ad2bf69e969e409'
var searchCity = ""

var lang = 'en'
var units = 'imperial'

var searchInput = document.getElementById("search");
var submitBtn = document.getElementById("submit-btn");

var cities = [];

// The submitBtn listener adds the search city to local storage
// and calls functions to get the current weather and render the search history
submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("submit button");

    searchCity = searchInput.value.trim()
    console.log("searchCity:", searchCity);

    searchInput.value = "";

    // prevent adding duplicate city
    if (!cities.includes(searchCity)) {
        cities.push(searchCity)
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    renderCities();
    getCurrent();
});

// The clearCityHTML function clears the existing rendered city HTML
// in preparation to be repopulated with the new city
function clearCityHTML() {
    console.log("clearing rendered current city from HTML");

    var current = document.getElementById("current");
    current.innerHTML = "";

    var forecast = document.getElementById("forecast");
    forecast.innerHTML = "";
}

// The clearCityListHTML function clears the existing rendered city button list HTML
// in preparation to be repopulated with the new list
function clearCityListHTML() {
    console.log("clearing rendered current city list from HTML");

    var citiesList = document.getElementById("cities-list");
    citiesList.innerHTML = "";
}

// The renderCities function renders cities from local storage to HTML list elements
function renderCities() {
    console.log("rendering cities, if any");

    clearCityListHTML()
    var storedCities = [];

    storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {

        for (var i = 0; i < storedCities.length; i++) {

            var btn = document.createElement("button");

            btn.textContent = storedCities[i]

            btn.addEventListener("click", function () {
                console.log(this.textContent);
                searchCity = this.textContent;
                getCurrent()
            })

            var citiesList = document.getElementById("cities-list");

            citiesList.appendChild(btn);
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
            var cityName = "City: " + data.name;
            var cityTemp = "Temp: " + data.main.temp + " fahrenheit";
            var cityWind = "Wind: " + data.wind.speed + "mph";
            var cityHumidity = "Humidity: " + data.main.humidity + "%";
            var cityIcon = data.weather[0].icon;
            var cityIconUrl = "http://openweathermap.org/img/w/" + cityIcon + ".png";
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            getForecast(lat, lon)

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

            var imgItem = document.createElement("img");
            imgItem.setAttribute("src", cityIconUrl);
            current.appendChild(imgItem);

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

            for (var i = 0; i < 5; i++) {

                var cityDate = new Date(data.list[i].dt*1000);
                var cityTemp = "Temp: " + data.list[i].main.temp + " fahrenheit";
                var cityWind = "Wind: " + data.list[i].wind.speed + "mph";
                var cityHumidity = "Humidity: " + data.list[i].main.humidity + "%";
                var cityIcon = data.list[i].weather[0].icon;
                var cityIconUrl = "http://openweathermap.org/img/w/" + cityIcon + ".png";

                var listItem = document.createElement("li");
                listItem.textContent = cityDate
                forecast.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityTemp;
                forecast.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityWind;
                forecast.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityHumidity;
                forecast.appendChild(listItem);

                var imgItem = document.createElement("img");
                imgItem.setAttribute("src", cityIconUrl);
                current.appendChild(imgItem);

                // var listItem = document.createElement("li");

                // listItem.textContent = new Date(data.list[i].dt*1000) + " " + "temp: " + data.list[i].main.temp;

                // TODO figure out how to grab 5 days, not 5 3-hour windows
                // when have limited, use similar to convert to yyyy-mm-dd or look into using dayjs
                // var date = new Date(someArray[i].dt*1000);
                // listItem.textContent = date.toISOString().split('T')[0]

                // console.log(listItem)
                // forecast.appendChild(listItem);
                // console.log(forecast.innerHTML)
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
