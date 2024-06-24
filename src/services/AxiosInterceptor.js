import axios from "axios";
import { APP_BACKEND } from "../config/constant";

const api = axios.create({
    baseURL: APP_BACKEND
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("token"));
        if (user && user.token) {
            console.log("test");
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => {
        return res;
    },

    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "/auth/sign-in" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const user = JSON.parse(localStorage.getItem("token"));
                    const rs = await instance.post("/auth/refreshToken", {
                        refreshToken: user.refreshToken
                    });

                    localStorage.setItem("token", JSON.stringify(rs.data));
                    return instance(originalConfig);
                } catch (error) {
                    localStorage.removeItem("token");
                    window.location = "/signin";
                }
            }
        }

        return Promise.reject(err);
    }
);

export default api;