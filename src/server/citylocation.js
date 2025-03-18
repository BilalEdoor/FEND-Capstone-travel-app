const axios = require("axios");

const getLocationData = async (destination, userKey) => {
    try {
        const result = await axios.get(`https://secure.geonames.org/searchJSON`, {
            params: {
                q: destination,
                maxRows: 1,
                username: userKey
            }
        });

        const { data } = result;

        if (!data.geonames.length) {
            return {
                message: "Oops! Couldn't find this destination. Double-check the spelling.",
                error: true
            };
        }

        return data.geonames[0];
    } catch (err) {
        console.error("Unable to retrieve location info:", err.message);
        return {
            message: "Something went wrong while getting the location. Try again later!",
            error: true
        };
    }
};

module.exports = { getLocationData };
