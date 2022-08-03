import axios from 'axios';

const API_URL = 'http://localhost:3090/api/auth/'
//const API_URL = 'http://cpap-auth.jcloud.ik-server.com/api/auth/'

const register = (username, email, password) => {
    return axios.post(API_URL + 'register', {
        username,
        email,
        password,
    })
}

const login = (email, password) => {

    return axios
        .post(API_URL + 'signin', {
            email,
            password,
        })
        .then(response => {
            if (response.data.token) {

                localStorage.setItem('user', JSON.stringify(response.data))
            }
            console.log("Response data " + JSON.stringify(response.data))
            return response.data
        })
}

const logout = () => {
    localStorage.removeItem('user')
}

export default {
    register,
    login,
    logout,
}
