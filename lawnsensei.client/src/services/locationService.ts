// locationService.ts

export const getUserLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    reject("Unable to retrieve your location");
                }
            );
        } else {
            reject("Geolocation is not supported by this browser");
        }
    });
};

// Function to get user's address using Google Maps Geocoding API
export const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
): Promise<string> => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBotGsLJ74W2X5sfcsVshdFKssaa7OnyCE`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].formatted_address;
        } else {
            throw new Error("No address found for these coordinates");
        }
    } catch (error) {
        console.error("Error fetching address:", error);
        throw new Error("Unable to determine address from coordinates");
    }
};

// Function to determine climate zone based on latitude
export const getClimateZone = (latitude: number): string => {
    if (latitude >= -23.5 && latitude <= 23.5) {
        return 'Tropical';
    } else if (latitude > 23.5 && latitude <= 40) {
        return 'Subtropical';
    } else if (latitude > 40 && latitude <= 60) {
        return 'Temperate';
    } else if (latitude > 60 || latitude < -60) {
        return 'Polar';
    } else {
        return 'Continental';
    }
};