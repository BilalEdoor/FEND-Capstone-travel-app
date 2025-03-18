const axios = require("axios");

const getCityPhoto = async (destinationName, apiToken) => {
    try {
        const response = await axios.get("https://pixabay.com/api/", {
            params: {
                key: apiToken,
                q: destinationName,
                image_type: "photo"
            }
        });

        const { hits } = response.data;

        // Choose the first image or use a default fallback
        const cityImage = hits?.length 
            ? hits[0].webformatURL 
            : "https://source.unsplash.com/640x480/?cityscape,travel?random=1";

        return { cityImage };

    } catch (err) {
        console.error("Failed to retrieve city photo:", err.message);
        return {
            cityImage: "https://source.unsplash.com/640x480/?cityscape,travel?random=1"
        };
    }
};

module.exports = { getCityPhoto };
