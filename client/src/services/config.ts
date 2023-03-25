import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL || "http://localhost:8080/api/v1",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
})

// axiosConfig.instance.interceptors.request.use(
//     (config) => {
//         const accessToken = store.dispatch()
//         console.log(accessToken)
//         if (config && config.headers) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`
//         }
//         return config
//     },
//     (error) => {
//         Promise.reject(error)
//     }
// )

// axiosConfig.instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config

//         if (error.response.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true
//             const response = await refreshTokenThunk()
//             console.log(response)

//             //axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
//             return axiosConfig.instance(originalRequest)
//         }
//         return Promise.reject(error)
//     }
// )

// axiosConfig.instance.interceptors.request.use(
//     (config) => {
//         const accessToken = store.dispatch()
//         console.log(accessToken)
//         if (config && config.headers) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`
//         }
//         return config
//     },
//     (error) => {
//         Promise.reject(error)
//     }
// )

// axiosConfig.instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config

//         if (error.response.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true
//             const response = await refreshTokenThunk()
//             console.log(response)

//             //axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
//             return axiosConfig.instance(originalRequest)
//         }
//         return Promise.reject(error)
//     }
// )

export default axiosInstance