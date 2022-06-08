import axios from 'axios';
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/test/'

const getAdminBoard = () => {
    return axios.get(API_URL + 'admin', { headers: authHeader() })
}

const getDoctorBoard = () => {
    return axios.get(API_URL + 'doc', { headers: authHeader() })
}

const getPublicContent = () => {
    return axios.get(API_URL + 'all')
}

const getUserBoard = () => {
    return axios.get(API_URL + 'user', { headers: authHeader() })
}

export default {
    getAdminBoard,
    getDoctorBoard,
    getPublicContent,
    getUserBoard,
}
