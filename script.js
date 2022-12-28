// TODO: replace plain text apikey with a secure solution
const key = '5a295bb52d6491ec7ad2bf69e969e409'
var searchCity = ""

var lang = 'en'
var units = 'imperial'

var searchInput = document.getElementById("search");
var submitBtn = document.getElementById("submit-btn");
var current = document.getElementById("current");

var cities = [];

// The submitBtn listener adds the search city to local storage
// and calls functions to get the current weather and render the search history.
submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("submit button");

    searchCity = searchInput.value.trim()
    console.log("searchCity:", searchCity);

    searchInput.value = "";

    // prevent city duplication
    if (!cities.includes(searchCity)) {
        cities.push(searchCity)
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    current.classList.remove("is-hidden");

    renderCities();
    getCurrent();
});

// The clearCityHTML function clears the existing rendered city HTML
// in preparation to be repopulated with the new city.
function clearCityHTML() {
    console.log("clearing rendered current city from HTML");

    var current = document.getElementById("current");
    current.innerHTML = "";

    var forecast = document.getElementById("forecast");
    forecast.innerHTML = "";
}

// The clearCityListHTML function clears the existing rendered city button list HTML
// in preparation to be repopulated with the new list.
function clearCityListHTML() {
    console.log("clearing rendered current city list from HTML");

    var citiesList = document.getElementById("cities-list");
    citiesList.innerHTML = "";
}

// The renderCities function renders cities from local storage to HTML list elements.
function renderCities() {
    console.log("rendering cities, if any");

    clearCityListHTML()
    var storedCities = [];

    storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {

        for (var i = 0; i < storedCities.length; i++) {

            var btn = document.createElement("button");
            btn.setAttribute("class", "button")
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

// The getCurrent function will get current weather data from the selected city.
// render the current weather elements to the site,
// and also pass lat and lon to the getForecast function.
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
            var cityDateE = new Date(data.dt*1000);
            var cityDate = cityDateE.toDateString();
            var cityName = data.name;
            var cityTemp = "Temp: " + data.main.temp + " fahrenheit";
            var cityWind = "Wind: " + data.wind.speed + "mph";
            var cityHumidity = "Humidity: " + data.main.humidity + "%";
            var cityIcon = data.weather[0].icon;
            var cityIconUrl = "http://openweathermap.org/img/w/" + cityIcon + ".png";
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            getForecast(lat, lon)

            var imgItem = document.createElement("img");
            imgItem.setAttribute("src", cityIconUrl);
            current.appendChild(imgItem);

            var listItem = document.createElement("li");
            listItem.textContent = cityName;
            listItem.setAttribute("class", "is-size-5 has-text-weight-semibold");
            current.appendChild(listItem);

            listItem = document.createElement("li");
            listItem.textContent = cityDate;
            listItem.setAttribute("class", "has-text-weight-semibold");
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
        })
        .catch(function (error){
            console.log(error)
        })
};

// The getForecast function will get the next 5 days of weather data from the selected city
// and render the weather elements to the site.
function getForecast(lat, lon) {
    console.log("getForecast")

    var forecast = document.getElementById("forecast")

    var requestUrl= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=${lang}&units=${units}`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            for (var i = 7; i < 47; i+=8) {

                var cityDateE = new Date(data.list[i].dt*1000);
                var cityDate = cityDateE.toDateString();
                var cityTemp = "Temp: " + data.list[i].main.temp + "F";
                var cityWind = "Wind: " + data.list[i].wind.speed + "mph";
                var cityHumidity = "Humidity: " + data.list[i].main.humidity + "%";
                var cityIcon = data.list[i].weather[0].icon;
                var cityIconUrl = "http://openweathermap.org/img/w/" + cityIcon + ".png";

                // ul element works with no-bullets class
                var column = document.createElement("ul")
                column.setAttribute("class", "column card no-bullets");
                forecast.appendChild(column);
  
                var imgItem = document.createElement("img");
                imgItem.setAttribute("src", cityIconUrl);
                column.appendChild(imgItem);

                listItem = document.createElement("li");
                listItem.textContent = cityDate
                listItem.setAttribute("class", "has-text-weight-semibold");
                column.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityTemp;
                column.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityWind;
                column.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = cityHumidity;
                column.appendChild(listItem);
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
