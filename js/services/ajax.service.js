'use strict'

export const ajaxService = {
    getSearchAPI,
}

const API_KEY = 'AIzaSyC5idAOLFGUz3mtXME-jgQGPAKuZH3c_dI';

function getSearchAPI(searchVal){
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchVal}&key=${API_KEY}`)
    .then(res => res.data)
    .then(res => ( res.results[0].geometry.location ) )
}