const axios = require("axios");

const fetchWeatherData = async (longitude, latitude, remainingDays, apiKey) => {
    try {
        // Check if date is in the past
        if (remainingDays < 0) {
            return { message: "Date cannot be in the past", error: true };
        }

        let weatherData;

        // If the trip is within the next 7 days, fetch current weather
        if (remainingDays > 0 && remainingDays <= 7) {
            const { data } = await axios.get(`https://api.weatherbit.io/v2.0/current`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    units: "M",
                    key: apiKey
                }
            });

            const { weather, temp } = data.data[0];
            weatherData = { description: weather.description, temp };

        // If the trip is more than 7 days away, fetch weather forecast
        } else if (remainingDays > 7) {
            const { data } = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    units: "M",
                    days: remainingDays,
                    key: apiKey
                }
            });

            const { weather, temp, app_max_temp, app_min_temp } = data.data[data.data.length - 1];
            weatherData = { description: weather.description, temp, app_max_temp, app_min_temp };
        }

        console.log("✨ Weather Data:", weatherData);
        return weatherData;

    } catch (error) {
        console.error("❌ Error fetching weather data:", error.message);
        return { message: "Failed to fetch weather data", error: true };
    }
};

module.exports = { fetchWeatherData };
