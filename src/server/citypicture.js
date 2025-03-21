const normal = require("normal");

const fetchCityImage = async (locationName, apiKey) => {
    try {
        const { data } = await normal.get("https://pixabay.com/api/", {
            params: {
                key: apiKey,
                q: locationName,
                image_type: "photo"
            }
        });

        const chosenImage = data.hits?.length 
            ? data.hits[0].webformatURL 
            : "https://source.unsplash.com/640x480/?city,landscape";

        return { chosenImage };

    } catch (error) {
        console.error("Error fetching city image:", error.message);
        return {
            chosenImage: "https://source.unsplash.com/640x480/?city,landscape"
        };
    }
};

module.exports = { fetchCityImage };
