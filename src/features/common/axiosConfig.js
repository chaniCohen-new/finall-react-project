import axios from "axios";

const instance = axios.create({ baseURL: 'http://localhost:5000' });

instance.interceptors.request.use((value) => {
    if (localStorage.myToken) {
        value.headers.Authorization = `Bearer ${localStorage.myToken}`;
    }
    return value;
});


instance.interceptors.response.use(
    (response) => {
        // For successful responses, simply return the response
        return response;
    },
    (error) => {
        // Handle error responses
        if (error.response) {
            // Server responded with a status other than 2xx
            const status = error.response.status;
            const message = error.response.data?.message || 'An unexpected error occurred.';

            alert(`Error ${status}: ${message}`);

            // Optionally, handle specific status codes
            if (status === 401) {
                // Redirect to login page, clear token, etc.
                console.log('Unauthorized request, redirecting to login...');
                // window.location.href = '/login';
            }
        } else if (error.request) {
            // Request was made but no response was received
            alert('No response received from the server. Please check your network connection.');
        } else {
            // Something else happened while setting up the request
            alert('An error occurred while setting up the request.');
        }

        return Promise.reject(error);
    }
);

export default instance;