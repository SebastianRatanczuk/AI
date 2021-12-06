const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector)
        this.currentWatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.currentWeather = undefined;

        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecast = undefined;


    }

    getCurrentWeather(query) {
        let url = this.currentWatherLink.replace("{query}", query);

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.currentWeather = data;
                this.drawWeather();
            });
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.forecast = data.list;
                this.drawWeather();
            });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {

        this.resultsBlock.innerHTML = "";
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.resultsBlock.appendChild(weatherBlock);
        }

        if (this.forecast) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];

                const date = new Date(weather.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    weather.main.temp,
                    weather.main.feels_like,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
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