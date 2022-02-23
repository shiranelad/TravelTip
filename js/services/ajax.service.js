'use strict'

export const ajaxService = {
    getSearchAPI,
    getWeatherAPI,
}


function getSearchAPI(searchVal) {
    const API_KEY = 'AIzaSyC5idAOLFGUz3mtXME-jgQGPAKuZH3c_dI'; /* TB */
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchVal}&key=${API_KEY}`)
        .then(res => res.data)
        .then(res => (res.results[0].geometry.location))
        .catch('Problem with API')
}

function getWeatherAPI(loc = { lat: 32.7940, lng: 34.9896 }) {
    const W_KEY = '11936104c6295738ce09f3af46455865' /* SE */
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&units=metric&APPID=${W_KEY}`)
        .then(res => res.data)
        .then(res => (
            {
                main: res.main,
                name: res.name,
                desc: res.weather[0].description,
                icon: res.weather[0].icon,
                wind: res.wind
            }
        ))
        .catch('Problem with API')
}