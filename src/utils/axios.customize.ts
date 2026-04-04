
import axios, { type AxiosInstance } from "axios";

interface AxiosCustomInstance extends AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
}
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
    timeout: 60 * 500 //10s
}) as AxiosCustomInstance;;

// Add a request interceptor
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    // config.headers["delay"] = 5000
    const obj = localStorage.getItem("access_token");
    const access_token = obj ? JSON.parse(obj)?.token : null;
    if (access_token) config.headers["Authorization"] = `Bearer ${access_token}`
    console.log("access_token:", access_token);
    console.info("baseURL:", instance.defaults.baseURL);
    console.info("Requesting:", config.url, config.method, config.data, config.params);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status === 400) throw new Error(response.data?.message || "Bad Request");
    if (response.data) return response.data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
});
export default instance