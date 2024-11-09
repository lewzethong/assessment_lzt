import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

//request interceptor
apiClient.interceptors.request.use(
  (config) => {
    //To capture the request but not needed in this case
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error details to console, but details not complete to handle which error message
    console.error("API Error:");
    return Promise.reject(error);
  }
);

export default apiClient;
