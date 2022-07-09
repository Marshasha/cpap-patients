import axios from 'axios';


const API_URL = 'http://localhost:8181/api/measures/'

const saveKeyData = (userID, keyDataArray) => {
    return axios.post(API_URL + 'users', {
        userID,
        keyDataArray,
    })
}

const getPatientsList = () => {
    return axios.get(API_URL + "users")
}

const getKeyData = () => {
    return axios.get(API_URL + "measures")
}


export default {
    saveKeyData,
    getPatientsList,
    getKeyData
}
