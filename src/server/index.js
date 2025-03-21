const express = require("express");
const cors = require("cors");
require("dotenv").config();

// استيراد الدوال بأسماء جديدة
const { getPlaceInfo } = require("./locationService");
const { fetchWeatherData } = require("./weatherService");
const { grabCityImage } = require("./imageService");

const app = express();
const SERVER_PORT = process.env.PORT || 8000;

// تهيئة الميدل وير
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// إعداد المتغيرات البيئية
const geoApiUser = `${process.env.USERNAME}${process.env.USERNUMBER}`;
const weatherApiToken = process.env.WEATHER_KEY;
const imageApiToken = process.env.pixabay_key;

// المسار الرئيسي
app.get("/", (req, res) => res.render("index.html"));

// مسار الحصول على بيانات الموقع
app.post("/get-location", async (req, res) => {
    const { destination } = req.body;
    try {
        const placeData = await getPlaceInfo(destination, geoApiUser);
        res.json(placeData);
    } catch (error) {
        console.error("⚠️ Failed to fetch location data:", error.message);
        res.status(500).json({ error: "Could not fetch location data. Please try again later." });
    }
});

// مسار جلب بيانات الطقس
app.post("/get-weather", async (req, res) => {
    const { longitude, latitude, remainingDays } = req.body;
    try {
        const weatherDetails = await fetchWeatherData(longitude, latitude, remainingDays, weatherApiToken);
        res.json(weatherDetails);
    } catch (error) {
        console.error("⚠️ Weather data fetch failed:", error.message);
        res.status(500).json({ error: "Weather data is unavailable. Please retry!" });
    }
});

// مسار جلب صورة المدينة
app.post("/get-city-image", async (req, res) => {
    const { destinationName } = req.body;
    try {
        const cityImageResult = await grabCityImage(destinationName, imageApiToken);
        res.json(cityImageResult);
    } catch (error) {
        console.error("⚠️ Image fetch failed:", error.message);
        res.status(500).json({ error: "City image could not be retrieved. Try again!" });
    }
});

// تشغيل السيرفر
app.listen(SERVER_PORT, () => console.log(`✅ Server live at: http://localhost:${SERVER_PORT}`));
