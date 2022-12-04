const key = '163a9b550e5a84d073437283547bd3e1'

var lat = 44.979530
var lon = -93.235190
var lang = 'en'
var units = 'imperial'

function getApi() {
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=${lang}&units=${units}`;
  
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
    });
};

function init() {
    getApi()
}

init()