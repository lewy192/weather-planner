const cardContainer = document.querySelector(".card-forcast-container");
const citySelection = document.querySelector(".city-selection-container");
const currentCityForcast = document.querySelector(".current-city-weather");
const citySearchButton = document.querySelector(".city-search-button");
const cityNameHeader = document.querySelector(".city-name");
const searchVal = document.querySelector(".city-search-input");

const apiKey = "7e5922ef7f6bc85e485e53b28667f43a";

// const getCityCoords = api.openweathermap.org/data/2.5/weather?

function displayCurrentWeather(cityCoords, cityName) {
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
            const errorParagraph = document.querySelector(".error-paragraph");
            if (errorParagraph) {
                errorParagraph.remove();
            }
            for (const child of currentCityForcast.children) {
                child.style.display = "block";
            }
            // console.log(data);
            checkLocal();
            const icon = document.querySelector(".current-icon");
            cityNameHeader.textContent = cityName.split(",")[0];
            windSpeedFigure.textContent = windSpeedFigure.textContent = `Wind Speed:${data.current.wind_speed}`;
            tempFigure.textContent = `Temperature:${data.current.temp}`;
            humidFigure.textContent = `Humidity:${data.current.humidity}%`;
            uvIndexFigure.textContent = `UV-Index:`;
            console.log;

            icon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
            // icon.alt;
            const uvIndexNumber = document.createElement("span");
            uvIndexNumber.textContent = `${data.current.uvi}`;
            uvIndexColour(data.current.uvi, uvIndexNumber);
            uvIndexFigure.appendChild(uvIndexNumber);
            console.log("cards");
            fiveDayForecastCards(data);
            addSearchToLocal(searchVal.value);
            searchVal.value = "";
        })
        .catch((err) => {
            cityName.textContent = "Error with weather api";
        });
}

function getCityCoords(apiKey, cityName) {
    // const urlWeatherByCityName = `https://api.openweathermap.org/geo/1.0/direct?q=melbourne,au&appid=${apiKey}`;
    const urlWeatherByCityName = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    fetch(urlWeatherByCityName)
        .then(function (response) {
            if (response.ok) return response.json();
            throw new Error("Geocoding Api Failed");
        })
        .then(function (data) {
            displayCurrentWeather(data, cityName);
        })
        .catch(function (err) {
            if (err.constructor === TypeError) {
                for (const child of currentCityForcast.children) {
                    child.style.display = "none";
                }
                const errorParagraph = document.createElement("pre");
                errorParagraph.textContent =
                    "ERROR:\nTry another city. \nMake sure you enter it in the format:\nCityName,CountryCode";
                errorParagraph.style.fontSize = "16px";
                errorParagraph.style.fontWeight = "bold";
                errorParagraph.classList.add("error-paragraph");
                currentCityForcast.appendChild(errorParagraph);
            } else {
                cityNameHeader.textContent =
                    "Geoencoding Api failed, try again later.";
            }
        });
}

function executeCityWeatherSearch() {
    const cityNameInput = document.querySelector(".city-search-input");
    getCityCoords(apiKey, cityNameInput.value);
}

function addCityButtons() {
    const cityList = JSON.parse(localStorage.getItem("cityList"));
    const cityTextArray = [];
    Array.from(citySelection.children)
        .slice(2)
        .forEach((child) => {
            // cityTextArray.push(child.textContent);
            child.remove();
        });
    for (let city of new Set(cityList.slice(0, 14))) {
        if (city) {
            const newButton = document.createElement("button");
            newButton.innerHTML = city;
            newButton.classList.add("city-button");
            citySelection.appendChild(newButton);
        }
    }
}

function checkLocal() {
    let cityList = JSON.parse(localStorage.getItem("cityList"));
    if (cityList) {
        addCityButtons();
    }
    return;
}

function addSearchToLocal(searchValue) {
    let cityList = JSON.parse(localStorage.getItem("cityList"));
    if (cityList) {
        cityList.push(searchValue);
        localStorage.setItem("cityList", JSON.stringify(cityList));
    } else {
        cityList = [];
        cityList.push(searchValue);
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }
}

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
        icon.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
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

citySearchButton.addEventListener("click", function (event) {
    event.preventDefault();
    executeCityWeatherSearch();
});

checkLocal();
