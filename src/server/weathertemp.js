const axios = require("axios");

const getWeatherInfo = async (lng, lat, daysLeft, apiKey) => {
    try {
        // Prevent fetching data for past dates
        if (daysLeft < 0) {
            return { message: "Oops! The date is in the past.", error: true };
        }

        let weatherDetails;

        // For trips within the next week, fetch real-time weather
        if (daysLeft > 0 && daysLeft <= 7) {
            const response = await axios.get(`https://api.weatherbit.io/v2.0/current`, {
                params: {
                    lat,
                    lon: lng,
                    units: "M",
                    key: apiKey
                }
            });

            const { weather, temp } = response.data.data[0];
            weatherDetails = { condition: weather.description, currentTemp: temp };

        // For longer waits, fetch a future weather forecast
        } else if (daysLeft > 7) {
            const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
                params: {
                    lat,
                    lon: lng,
                    units: "M",
                    days: daysLeft,
                    key: apiKey
                }
            });

            const { weather, temp, app_max_temp, app_min_temp } = response.data.data[response.data.data.length - 1];
            weatherDetails = {
                condition: weather.description,
                forecastTemp: temp,
                maxTemp: app_max_temp,
                minTemp: app_min_temp
            };
        }

        console.log("🌦️ Weather Details:", weatherDetails);
        return weatherDetails;

    } catch (err) {
        console.error("⚡ Failed to get weather data:", err.message);
        return { message: "Unable to retrieve weather information.", error: true };
    }
};

module.exports = { getWeatherInfo };
