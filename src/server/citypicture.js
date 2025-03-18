const axios = require("axios");

const fetchCityImage = async (city, apiKey) => {
    try {
        const { data } = await axios.get("https://pixabay.com/api/", {
            params: {
                key: apiKey,
                q: city,
                image_type: "photo"
            }
        });

        // Fallback image if no results are found
        const image = data.hits.length > 0 
            ? data.hits[0].webformatURL 
            : "https://source.unsplash.com/random/640x480?city,morning,night?sig=1";

        // Return an object with the image property
        return { image };

    } catch (error) {
        console.error("Error fetching city image:", error.message);
        return {
            image: "https://source.unsplash.com/random/640x480?city,morning,night?sig=1" // Use fallback on error
        };
    }
};

module.exports = { fetchCityImage };
