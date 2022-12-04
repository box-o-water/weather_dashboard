const key = '163a9b550e5a84d073437283547bd3e1'
var searchCity = ""
var lat = 44.979530
var lon = -93.235190
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
    // clearRenderedCitiesHTML();
    renderCities();
    getCurrent();
});

// The clearRenderedCitiesHTML function clears the existing rendered HTML list in preparationto be repopulated with the new rendered list
function clearRenderedCitiesHTML() {
    console.log("clearing rendered cities from HTML");

    var citiesList = document.getElementById("citiesList");
    console.log("before clear: ", citiesList.innerHTML);
    citiesList.innerHTML = "";
    console.log("after clear: ", citiesList.innerHTML);
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

    var current = document.getElementById("current")

    var requestUrl= `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${key}&lang=${lang}&units=${units}`;
  
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var someCity = data.name;
            lat = data.coord.lat;
            lon = data.coord.lon;
            temp = data.main.temp;

            console.log(lat)
            console.log(lon)

                var listItem = document.createElement("li");
                listItem.textContent = someCity;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = lat;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = lon;
                current.appendChild(listItem);

                listItem = document.createElement("li");
                listItem.textContent = temp;
                current.appendChild(listItem);

        })
        .catch(function (error){
            console.log(error)
        })
};

function getForecast() {
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

                // when have limited to 5 days and not 5 3-hour sections, to convert to yyyy-mm-dd
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
    getCurrent()
    getForecast()
}

init()