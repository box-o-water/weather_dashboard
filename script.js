// TODO: figure out how to set this up with a new key as a secret in github or something
const key = '163a9b550e5a84d073437283547bd3e1'
var searchCity = ""


// askbcs: these vars here were temporarily set to something to test returning vals from api
// i either want them set to nothing, or not create them here (most likely), but in the getCurrent function
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



            // askbcs: here is where i want to initially define lat and lon,
            // or just update the values based on the searched city if defined globally
            // this does seem to be updating the values from the searched city
            lat = data.coord.lat;
            lon = data.coord.lon;
            console.log(lat)
            console.log(lon)



            temp = data.main.temp;

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


        // askbcs: i want the new lat and lon values to be available in the getForecast function
        // tried `return [lat,lon]` and other things

};


// askbcs: i want call this function only after the searched city has updated the lat and lon values in getCurrent
// and i want those updated lat and lon values to be available in this function
// i don't currently have any of my attempts for returning/passing values/calling this function in here, as none were working
function getForecast() {
    console.log("getForecast")

    var forecast = document.getElementById("forecast")

    // askbcs: here is where i need to use the updated lat and lon values
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
    // eventually not call this until the submit button is pressed, to get rid of some console errors
    getCurrent()


    // askbcs: i don't really want to call getForecast right away
    // i want to wait to call this only after the searched city has updated the lat and lon values
    getForecast()
}

init()