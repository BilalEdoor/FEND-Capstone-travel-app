const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import functions with new names
const { fetchLocationData } = require("./locationService");
const { retrieveWeatherInfo } = require("./weatherService");
const { fetchCityImage } = require("./imageService");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware setup
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// Environment variables setup
const geoUsername = `${process.env.USERNAME}${process.env.USERNUMBER}`;
const weatherApiKey = process.env.WEATHER_KEY;
const imageApiKey = process.env.pixabay_key;

// Root route
app.get("/", (req, res) => res.render("index.html"));

// Endpoint for city location data
app.post("/location", async (req, res) => {
    const { city } = req.body;
    try {
        const cityData = await fetchLocationData(city, geoUsername);
        res.json(cityData);
    } catch (err) {
        console.error("❌ Location retrieval failed:", err.message);
        res.status(500).json({ error: "Could not retrieve location data. Please try again!" });
    }
});

// Endpoint for weather data
app.post("/weather", async (req, res) => {
    const { lng, lat, daysRemaining } = req.body;
    try {
        const weatherInfo = await retrieveWeatherInfo(lng, lat, daysRemaining, weatherApiKey);
        res.json(weatherInfo);
    } catch (err) {
        console.error("❌ Weather retrieval failed:", err.message);
        res.status(500).json({ error: "Could not retrieve weather information. Please try again!" });
    }
});

// Endpoint for city image
app.post("/city-image", async (req, res) => {
    const { cityName } = req.body;
    try {
        const cityImage = await fetchCityImage(cityName, imageApiKey);
        res.json(cityImage);
    } catch (err) {
        console.error("❌ City image retrieval failed:", err.message);
        res.status(500).json({ error: "Could not retrieve city image. Please try again!" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server up and running at http://localhost:${PORT}`));
