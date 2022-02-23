import { ajaxService } from './ajax.service.js';
export const mapService = {
    initMap,
    panTo,
    getMap,
    searchLocation,
}
window.onCopyLocation = onCopyLocation;

var gCurrPosition = {}
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
        })
}

function panTo(lat, lng) {
    gCurrPosition = { lat, lng }
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
    ajaxService.getWeatherAPI(gCurrPosition)
        .then(renderWeather)
        .catch('No values found')
}

function getMap() {
    return gMap;
}

function searchLocation(searchVal) {
    return ajaxService.getSearchAPI(searchVal)
        .then(res => panTo(res.lat, res.lng))
}

function onCopyLocation() {
    var url = `https://shiranelad.github.io/TravelTip/?lat=${gCurrPosition.lat}&lng=${gCurrPosition.lng}`
    navigator.clipboard.writeText(url)
    document.querySelector('.btn-copy-location').innerText = 'Copied!'
    setTimeout(() => {
        document.querySelector('.btn-copy-location').innerText = 'Copy Location'
    }, 1500)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyC5idAOLFGUz3mtXME-jgQGPAKuZH3c_dI';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}