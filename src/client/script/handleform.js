import axios from "axios";

const form = document.querySelector("form");
const cityInput = document.querySelector("#city");
const dateInput = document.querySelector("#flightDate");

const cityError = document.querySelector("#city_error");
const dateError = document.querySelector("#date_error");

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("Submission triggered");

  if (!validateInputs()) return;

  try {
    const locationData = await fetchCityLocation();
    if (locationData?.error) return displayError(cityError, locationData.message);

    const { lng, lat, name } = locationData;
    const flightDate = dateInput.value;
    if (!flightDate) return displayError(dateError, "Please enter the date");

    const daysRemaining = calculateDaysRemaining(flightDate);
    const weatherData = await fetchWeatherData(lng, lat, daysRemaining);
    if (weatherData?.error) return displayError(dateError, weatherData.message);

    const cityImage = await fetchCityImage(name);
    renderUI(daysRemaining, name, cityImage, weatherData);
  } catch (error) {
    console.error("Error processing form submission:", error);
  }
};

const validateInputs = () => {
  clearErrors();

  if (!cityInput.value) return displayError(cityError, "City is required");
  if (!dateInput.value) return displayError(dateError, "Date is required");
  if (calculateDaysRemaining(dateInput.value) < 0) return displayError(dateError, "Date cannot be in the past");

  return true;
};

const fetchCityLocation = async () => {
  try {
    const response = await axios.post("http://localhost:8000/getCity", form, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch city location:", error);
    return { error: true, message: "Failed to fetch city location" };
  }
};

const fetchWeatherData = async (lng, lat, daysRemaining) => {
  try {
    const response = await axios.post("http://localhost:8000/getWeather", { lng, lat, daysRemaining });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return { error: true, message: "Failed to fetch weather data" };
  }
};

const calculateDaysRemaining = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  return Math.ceil((targetDate - today) / (1000 * 3600 * 24));
};

const fetchCityImage = async (cityName) => {
  try {
    const response = await axios.post("http://localhost:8000/getCityPic", { city_name: cityName });
    return response.data.image;
  } catch (error) {
    console.error("Failed to fetch city image:", error);
    return "";
  }
};

const renderUI = (daysRemaining, city, cityImage, weather) => {
  document.querySelector("#Rdays").textContent = `Your trip starts in ${daysRemaining} days`;
  document.querySelector(".cityName").textContent = `Location: ${city}`;
  document.querySelector(".weather").textContent = daysRemaining > 7 ? `Weather is: ${weather.description}` : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML = daysRemaining > 7 ? `Forecast: ${weather.temp}&degC` : `Temperature: ${weather.temp}&degC`;
  document.querySelector(".max-temp").textContent = daysRemaining > 7 ? `Max Temp: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").textContent = daysRemaining > 7 ? `Min Temp: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `<img src="${cityImage}" alt="City view"/>`;
  document.querySelector(".flight_data").style.display = "block";
};

const displayError = (element, message) => {
  element.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  element.style.display = "block";
};

const clearErrors = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";
};

export { handleSubmit };
