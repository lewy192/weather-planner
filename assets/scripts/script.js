const cardContainer = document.querySelector(".card-forcast-container");
const citySelection = document.querySelector(".city-selection-container");
const currentCityForcast = document.querySelector(".current-city-weather");
const citySearchButton = document.querySelector(".city-search-button");
const cityNameHeader = document.querySelector(".city-name");

const apiKey = "7e5922ef7f6bc85e485e53b28667f43a";

// const getCityCoords = api.openweathermap.org/data/2.5/weather?

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
            console.log(data);
            // TODO: delete errorPara and add city name header back
            cityNameHeader.textContent = data.timezone.split("/")[1];
            document
                .querySelectorAll(".figure")
                .forEach((element) => (element.style.display = "block"));
            windSpeedFigure.textContent = windSpeedFigure.textContent = `Wind Speed:${data.current.wind_speed}`;
            tempFigure.textContent = `Temperature:${data.current.temp}`;
            humidFigure.textContent = `Humidity:${data.current.humidity}%`;
            uvIndexFigure.textContent = `UV-Index:`;
            const uvIndexNumber = document.createElement("span");
            uvIndexNumber.textContent = `${data.current.uvi}`;
            uvIndexColour(data.current.uvi, uvIndexNumber);
            uvIndexFigure.appendChild(uvIndexNumber);
            fiveDayForecastCards(data);
        })
        .catch((err) => {
            cityName.textContent = "Error with weather api";
        });
}

function getCityCoords(apiKey, cityName) {
    // const urlWeatherByCityName = `http://api.openweathermap.org/geo/1.0/direct?q=melbourne,au&appid=${apiKey}`;
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
                // TODO: add class to errorPara
                currentCityForcast.appendChild(errorParagraph);
            } else {
                cityNameHeader.textContent =
                    "Geoencoding Api failed, try again later.";
            }
            // Notify user they have requested a city thats not availible
        });
}

function executeCityWeatherSearch() {
    const cityNameInput = document.querySelector(".city-search-input");
    getCityCoords(apiKey, cityNameInput.value);
}

// getCityCoords(apiKey, "Melbour");

citySearchButton.addEventListener("click", function (event) {
    event.preventDefault();
    executeCityWeatherSearch();
});

function uvIndexColour(uvindex, element) {
    if (uvindex < 3) {
        element.classList.add("uv-low");
    } else if (uvindex < 8 && !uvindex < 3) {
        element.classList.add("uv-mid");
    } else {
        element.classList.add("uv-high");
    }
    element.classList.add("uv-index-fig");
}

function fiveDayForecastCards(data) {
    cardContainer.querySelectorAll("*").forEach((child) => child.remove());
    const fiveDayForecastData = [];
    for (let i = 1; i < 6; i++) {
        fiveDayForecastData.push(data.daily[i]);
    }
    fiveDayForecastData.forEach((day) => {
        const dayCard = document.createElement("div");
        dayCard.classList.add("card");
        dayCard.classList.add("forecast-card");

        const dateHeader = document.createElement("h2");
        dateHeader.textContent = new Date(day.dt * 1000).toLocaleDateString(
            "en-US"
        );
        const icon = document.createElement("img");
        icon.src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const temperatureParagraph = document.createElement("p");
        temperatureParagraph.textContent = `Temperature:${day.temp.day}`;
        const humidParagraph = document.createElement("p");
        humidParagraph.textContent = `Humidity:${day.humidity}`;
        dayCard.appendChild(dateHeader);
        dayCard.appendChild(icon);
        dayCard.appendChild(temperatureParagraph);
        dayCard.appendChild(humidParagraph);
        cardContainer.appendChild(dayCard);
    });
}

citySelection.addEventListener("click", (event) => {
    if (event.target.matches(".city-button")) {
        // (event.target.textContent);
        getCityCoords(apiKey, event.target.textContent);
    }
});
