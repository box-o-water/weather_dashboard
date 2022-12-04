const key = '163a9b550e5a84d073437283547bd3e1'

var lat = 44.979530
var lon = -93.235190
var lang = 'en'
var units = 'imperial'

var listEL = document.getElementById("myData")

function getApi() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=${lang}&units=${units}`;
  
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var someArray = data.list;
            for (var i = 0; i < 5; i++) {
                // var listItem = someArray[i].dt_txt;
                // console.log(listItem)
                var listItem = document.createElement("li");

                listItem.textContent = new Date(someArray[i].dt*1000);

                // when have limited to 5 days and not 5 3-hour sections, to convert to yyyy-mm-dd
                // var date = new Date(someArray[i].dt*1000);
                // listItem.textContent = date.toISOString().split('T')[0]

                console.log(listItem)
                listEL.appendChild(listItem);
            }
        })
        .catch(function (error){
            console.log(error)
        })
};

function init() {
    getApi()
}

init()