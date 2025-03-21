const axios = require("axios");

const getWeatherInfo = async (lng, lat, daysLeft, apiKey) => {
    try {
        // 🛑 منع جلب بيانات تواريخ ماضية
        if (daysLeft < 0) {
            return { message: "❗Oops! This date is in the past.", error: true };
        }

        let weatherDetails;
        const baseUrl = "https://api.weatherbit.io/v2.0";

        // 🌤️ جلب الطقس الحالي للرحلات القريبة (7 أيام أو أقل)
        const endpoint = daysLeft > 0 && daysLeft <= 7 ? "current" : "forecast/daily";
        const params = {
            lat,
            lon: lng,
            units: "M",
            key: apiKey,
        };

        // إذا كانت الرحلة بعيدة، نضيف عدد الأيام
        if (endpoint === "forecast/daily") params.days = daysLeft;

        const response = await axios.get(`${baseUrl}/${endpoint}`, { params });
        const weatherData = response.data.data[endpoint === "current" ? 0 : response.data.data.length - 1];

        // 🔥 تجميع بيانات الطقس حسب نوع الطلب (current أو forecast)
        weatherDetails = {
            condition: weatherData.weather.description,
            currentTemp: weatherData.temp,
            maxTemp: weatherData.app_max_temp ?? null,
            minTemp: weatherData.app_min_temp ?? null,
        };

        console.log("🌦️ Weather Details:", weatherDetails);
        return weatherDetails;

    } catch (err) {
        console.error("⚡ Weather data retrieval failed:", err.message);
        return { message: "Unable to fetch weather data. Please try again.", error: true };
    }
};

module.exports = { getWeatherInfo };
