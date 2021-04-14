const cardContainer = document.querySelector(".card-forcast-container");
const citySelection = document.querySelector(".city-selection-container");
const currentCityForcast = document.querySelector(".current-city-weather");
const citySearchButton = document.querySelector(".city-search-button");

const apiKey = "7e5922ef7f6bc85e485e53b28667f43a";

const urlWeatherByCityName = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

function displayCurrentWeather(currentData) {
    const tempFigure = document.querySelector(".temp-figure");
    const humidFigure = document.querySelector(".humid-figure");
    const windSpeedFigure = document.querySelector(".wind-speed-fig");
    const uvIndexFigure = document.querySelector(".uv-index-fig");
    console.log(currentData);
}

function getCurrentWeather(apiKey) {
    fetch(apiKey)
        .then(function (response) {
            if (response.ok) return response.json();
            throw new Error("Weather Api Failed");
        })
        .then(function (data) {
            displayCurrentWeather(data);
        })
        .catch(function (err) {
            // handle err
        });
}

function executeCityWeatherSearch() {
    const cityNameInput = document.querySelector(".city-search-input");
}

getCurrentWeather(apiKey);

citySearchButton.addEventListener("click", function (event) {
    event.preventDefault();
    executeCityWeatherSearch();
});
