const cardContainer = document.querySelector(".card-forcast-container");
const citySelection = document.querySelector(".city-selection-container");
const currentCityForcast = document.querySelector(".current-city-weather");
const citySearchButton = document.querySelector(".city-search-button");
const cityNameHeader = document.querySelector(".city-name");

const apiKey = "7e5922ef7f6bc85e485e53b28667f43a";

const urlWeatherByCityName = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

function displayCurrentWeather(cityCoords) {
    const tempFigure = document.querySelector(".current-temp");
    const humidFigure = document.querySelector(".current-humid");
    const windSpeedFigure = document.querySelector(".current-wind-speed");
    const uvIndexFigure = document.querySelector(".current-uv-index");

    const cityLong = cityCoords[0].lon;
    const cityLat = cityCoords[0].lat;
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&appid=${apiKey}&units=metric`
    )
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error("Try a Different city");
        })
        .then((data) => {
            cityNameHeader.textContent = data.timezone.split("/")[1];
            document
                .querySelectorAll(".figure")
                .forEach((element) => (element.style.display = "block"));
            windSpeedFigure.textContent = windSpeedFigure.textContent = `Wind Speed:${data.current.wind_speed}`;
            tempFigure.textContent = `Temperature:${data.current.temp}`;
            humidFigure.textContent = `Humidity:${data.current.humidity}%`;
            uvIndexFigure.textContent = `UV-Index:${data.current.uvi}`;
        })
        .catch((err) => cityName.textContent);
}

function getCityCoords(apiKey, cityName) {
    // const urlWeatherByCityName = `http://api.openweathermap.org/geo/1.0/direct?q=melbourn,au&appid=${apiKey}`;
    const urlWeatherByCityName = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    fetch(urlWeatherByCityName)
        .then(function (response) {
            if (response.ok) return response.json();
            throw new Error("Geocoding Api Failed");
        })
        .then(function (data) {
            displayCurrentWeather(data);
        })
        .catch(function (err) {
            if (err.constructor === TypeError) {
                cityNameHeader.remove();
                const errorParagraph = document.createElement("pre");
                errorParagraph.textContent =
                    "ERROR:\nTry another city. \nMake sure you enter it in the format:\nCityName,CountryCode";
                errorParagraph.style.fontSize = "16px";
                errorParagraph.style.fontWeight = "bold";
                currentCityForcast.appendChild(errorParagraph);
            } else {
                cityNameHeader.textContent =
                    "Geoencoding Api failed, try again later.";
            }
            // console.log(err);
            // Notify user they have requested a city thats not availible
        });
}

function executeCityWeatherSearch() {
    const cityNameInput = document.querySelector(".city-search-input");
    console.log(cityNameInput.value);
    getCityCoords(apiKey, cityNameInput.value);
}

// getCityCoords(apiKey, "Melbour");

citySearchButton.addEventListener("click", function (event) {
    event.preventDefault();
    executeCityWeatherSearch();
});
