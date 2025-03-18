const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getCityLoc } = require("./getCityLoc");
const { weatherTemp } = require("./weatherTemp");
const { getCityPic } = require("./getCityPic");

const app = express();
const port = process.env.PORT || 8000;

// Middleware setup
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// Environment variables setup
const username = `${process.env.USERNAME}${process.env.USERNUMBER}`;
const WEATHER_KEY = process.env.WEATHER_KEY;
const PIXABAY_KEY = process.env.pixabay_key;

// Routes
app.get("/", (req, res) => res.render("index.html"));

// City location route
app.post("/getCity", async (req, res) => {
    const { city } = req.body;
    try {
        const location = await getCityLoc(city, username);
        res.json(location);
    } catch (error) {
        console.error("Error fetching city location:", error.message);
        res.status(500).json({ error: "Failed to fetch city location." });
    }
});

// Weather route
app.post("/getWeather", async (req, res) => {
    const { lng, lat, remainingDays } = req.body;
    try {
        const weatherData = await weatherTemp(lng, lat, remainingDays, WEATHER_KEY);
        res.json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});

// City picture route
app.post("/getCityPic", async (req, res) => {
    const { city_name } = req.body;
    try {
        const cityImage = await getCityPic(city_name, PIXABAY_KEY);
        res.json(cityImage);
    } catch (error) {
        console.error("Error fetching city picture:", error.message);
        res.status(500).json({ error: "Failed to fetch city picture." });
    }
});

// Server startup
app.listen(port, () => console.log(`✅ Server is running on http://localhost:${port}`));
