const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector)
    }

    getCurrentWeather(query) {

    }

    getForecast(query) {

    }

    getWeather(query) {
        const weatherBlock = this.createWeatherBlock('2020-12-11 17:30', 21.21, 23.4, '04n', 'scattered clouds')
        this.resultsBlock.appendChild(weatherBlock);
    }

    drawWeather() {

    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock = document.createElement('div');
        weatherBlock.className = "weather-block";

        const dateBLock = document.createElement('div');
        dateBLock.className = "weather-date";
        dateBLock.innerHTML = dateString;
        weatherBlock.appendChild(dateBLock)

        const temperatureBlock = document.createElement('div');
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock)

        const temperatureFeelsLikeBlock = document.createElement('div');
        temperatureFeelsLikeBlock.className = "weather-temperature-feels-like";
        temperatureFeelsLikeBlock.innerHTML = `Feel: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(temperatureFeelsLikeBlock)

        const iconImg = document.createElement('img');
        iconImg.className = "weather-icon";
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconImg)

        const weatherDescriptionBlock = document.createElement('div');
        weatherDescriptionBlock.className = "weather-description";
        weatherDescriptionBlock.innerHTML = description;
        weatherBlock.appendChild(weatherDescriptionBlock)

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function () {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});