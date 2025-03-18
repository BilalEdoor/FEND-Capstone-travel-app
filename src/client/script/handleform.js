import axios from "axios";

const travelForm = document.querySelector("form");
const locationInput = document.querySelector("#city");
const departureDate = document.querySelector("#flightDate");

const locationError = document.querySelector("#location-warning");
const dateWarning = document.querySelector("#date-warning");

const processForm = async (event) => {
  event.preventDefault();
  console.log("Form submission initiated!");

  if (!checkInputs()) return;

  try {
    const locationInfo = await getLocationData();
    if (locationInfo?.error) return showError(locationError, locationInfo.message);

    const { lng, lat, name } = locationInfo;
    const selectedDate = departureDate.value;
    if (!selectedDate) return showError(dateWarning, "Please select a departure date");

    const remainingDays = calculateDaysLeft(selectedDate);
    const weatherInfo = await getWeatherDetails(lng, lat, remainingDays);
    if (weatherInfo?.error) return showError(dateWarning, weatherInfo.message);

    const cityPicture = await getCityImage(name);
    updateUI(remainingDays, name, cityPicture, weatherInfo);
  } catch (error) {
    console.error("Error handling form submission:", error);
  }
};

const checkInputs = () => {
  resetErrors();

  if (!locationInput.value) return showError(locationError, "City is required");
  if (!departureDate.value) return showError(dateWarning, "Date is required");
  if (calculateDaysLeft(departureDate.value) < 0) return showError(dateWarning, "Date cannot be in the past");

  return true;
};

const getLocationData = async () => {
  try {
    const response = await axios.post("http://localhost:8000/getCity", travelForm, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    console.error("Error fetching city data:", error);
    return { error: true, message: "Could not retrieve city data" };
  }
};

const getWeatherDetails = async (lng, lat, remainingDays) => {
  try {
    const response = await axios.post("http://localhost:8000/getWeather", { lng, lat, remainingDays });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather details:", error);
    return { error: true, message: "Could not retrieve weather data" };
  }
};

const calculateDaysLeft = (date) => {
  const today = new Date();
  const target = new Date(date);
  return Math.ceil((target - today) / (1000 * 3600 * 24));
};

const getCityImage = async (cityName) => {
  try {
    const response = await axios.post("http://localhost:8000/getCityPic", { city_name: cityName });
    return response.data.image;
  } catch (error) {
    console.error("Error fetching city image:", error);
    return "";
  }
};

const updateUI = (remainingDays, city, cityImage, weather) => {
  document.querySelector("#Rdays").textContent = `Your journey starts in ${remainingDays} days`;
  document.querySelector(".cityName").textContent = `Destination: ${city}`;
  document.querySelector(".weather").textContent = remainingDays > 7 ? `Weather: ${weather.description}` : `Expected weather: ${weather.description}`;
  document.querySelector(".temp").innerHTML = remainingDays > 7 ? `Forecast: ${weather.temp}&degC` : `Current temp: ${weather.temp}&degC`;
  document.querySelector(".max-temp").textContent = remainingDays > 7 ? `High: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").textContent = remainingDays > 7 ? `Low: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `<img src="${cityImage}" alt="City view"/>`;
  document.querySelector(".flight_data").style.display = "block";
};

const showError = (element, message) => {
  element.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  element.style.display = "block";
};

const resetErrors = () => {
  locationError.style.display = "none";
  dateWarning.style.display = "none";
};

export { processForm };
