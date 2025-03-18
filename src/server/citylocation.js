const axios = require("axios");

const fetchCityLocation = async (city, username) => {
    try {
        const response = await axios.get(`https://secure.geonames.org/searchJSON`, {
            params: {
                q: city,
                maxRows: 1,
                username: username
            }
        });

        const { data } = response;

        if (!data.geonames.length) {
            return {
                message: "No city found with that name. Please check your spelling.",
                error: true
            };
        }

        return data.geonames[0];
    } catch (error) {
        console.error("Error fetching city data:", error.message);
        return {
            message: "Failed to fetch city data. Please try again later.",
            error: true
        };
    }
};

module.exports = { fetchCityLocation };
