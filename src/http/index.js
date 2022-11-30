import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(async (response) => {
    return response;
}, async (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem("fullName");
        localStorage.removeItem("token");
        localStorage.removeItem("questionnaireId");
        localStorage.removeItem("userId");
        window.location.replace("/login");
    }
    return Promise.reject(error);
});

export default api;