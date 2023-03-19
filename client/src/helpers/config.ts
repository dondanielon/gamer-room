import axios from 'axios'

export const axiosConfig = {
    instance: axios.create({
        baseURL: process.env.BASE_URL || 'http://localhost:8080/api',
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      })
}