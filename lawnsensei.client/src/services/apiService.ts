import { getRequest } from './httpService';

// Function to call protected backend API
export const callProtectedBackendApi = async () => {
    try {
        // Make a GET request to the protected endpoint
        const response = await getRequest('/api/lawn/protected-endpoint');
        console.log("Backend API Response:", response);
        alert("Protected Data: " + response.message);
    } catch (error) {
        console.error("Error calling backend API:", error);
        alert("Error accessing protected data. Please check your token or login again.");
    }
};
