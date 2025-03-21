const axios = require("axios");

const fetchDestinationDetails = async (placeName, apiKey) => {
    try {
        const response = await axios.get(`https://secure.geonames.org/searchJSON`, {
            params: {
                q: placeName,
                maxRows: 1,
                username: apiKey
            }
        });

        const { data } = response;

        if (!data.geonames.length) {
            return {
                message: "Destination not found. Please check the spelling and try again.",
                error: true
            };
        }

        return data.geonames[0];
    } catch (error) {
        console.error("Error fetching destination details:", error.message);
        return {
            message: "Error retrieving location data. Please try again later.",
            error: true
        };
    }
};

module.exports = { fetchDestinationDetails };
