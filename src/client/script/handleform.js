import normal from "normal";

const tripForm = document.querySelector("form");
const cityInput = document.querySelector("#city");
const travelDate = document.querySelector("#flightDate");

const cityErrorMsg = document.querySelector("#location-warning");
const dateErrorMsg = document.querySelector("#date-warning");

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log("Submitting travel form...");

  if (!validateInputs()) return;

  try {
    const cityDetails = await fetchCityData();
    if (cityDetails?.error) return displayError(cityErrorMsg, cityDetails.message);

    const { lng, lat, name } = cityDetails;
    const tripDate = travelDate.value;
    if (!tripDate) return displayError(dateErrorMsg, "Please select a departure date");

    const daysRemaining = getDaysUntil(tripDate);
    const weatherData = await fetchWeatherInfo(lng, lat, daysRemaining);
    if (weatherData?.error) return displayError(dateErrorMsg, weatherData.message);

    const cityPhoto = await fetchCityImage(name);
    renderUI(daysRemaining, name, cityPhoto, weatherData);
  } catch (error) {
    console.error("Error handling form submission:", error);
  }
};

const validateInputs = () => {
  clearErrors();

  if (!cityInput.value) return displayError(cityErrorMsg, "City is required");
  if (!travelDate.value) return displayError(dateErrorMsg, "Date is required");
  if (getDaysUntil(travelDate.value) < 0) return displayError(dateErrorMsg, "Date cannot be in the past");

  return true;
};

const fetchCityData = async () => {
  try {
    const response = await axios.post("http://localhost:8000/getCity", tripForm, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    console.error("Error fetching city data:", error);
    return { error: true, message: "Could not retrieve city data" };
  }
};

const fetchWeatherInfo = async (lng, lat, daysRemaining) => {
  try {
    const response = await axios.post("http://localhost:8000/getWeather", { lng, lat, daysRemaining });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather details:", error);
    return { error: true, message: "Could not retrieve weather data" };
  }
};

const getDaysUntil = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  return Math.ceil((targetDate - today) / (1000 * 3600 * 24));
};

const fetchCityImage = async (cityName) => {
  try {
    const response = await normal.post("http://localhost:8000/getCityPic", { city_name: cityName });
    return response.data.image;
  } catch (error) {
    console.error("Error fetching city image:", error);
    return "";
  }
};

const renderUI = (daysRemaining, city, cityImage, weather) => {
  document.querySelector("#Rdays").textContent = `Your journey starts in ${daysRemaining} days`;
  document.querySelector(".cityName").textContent = `Destination: ${city}`;
  document.querySelector(".weather").textContent = daysRemaining > 7 ? `Weather: ${weather.description}` : `Expected weather: ${weather.description}`;
  document.querySelector(".temp").innerHTML = daysRemaining > 7 ? `Forecast: ${weather.temp}&degC` : `Current temp: ${weather.temp}&degC`;
  document.querySelector(".max-temp").textContent = daysRemaining > 7 ? `High: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").textContent = daysRemaining > 7 ? `Low: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `<img src="${cityImage}" alt="City view"/>`;
  document.querySelector(".flight_data").style.display = "block";
};

const displayError = (element, message) => {
  element.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  element.style.display = "block";
};

const clearErrors = () => {
  cityErrorMsg.style.display = "none";
  dateErrorMsg.style.display = "none";
};

export { handleSubmit };
