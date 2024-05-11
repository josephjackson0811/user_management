import axios from 'axios'

const accessToken = window.localStorage.getItem('accessToken')

axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${accessToken}`

    return config;
}, (error) => {
    return Promise.reject(error)
} )