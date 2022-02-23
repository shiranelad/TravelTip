import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'



window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;
window.onSearch = onSearch;
window.onAddLocation = onAddLocation;
window.closeModal = closeModal;
window.renderWeather = renderWeather;

var markedPosition = {}

function onInit() {
    mapService.initMap()
        .then(() => {
            addMapListener()
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    onGetLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            var strHTML = locs.map(loc => { return `
            <div class="location-card  flex align-center space-between">
                <div>
                <div class="card-title">Name: <span>${loc.name}</span></div>
                <div class="card-latlng">lat: <span>${loc.lat}</span></div>
                <div class="card-latlng">lng: <span>${loc.lng}</span></div>
                </div>
                <div class="card-btns-container">
                <button class="card-btn" onclick="onPanTo(${loc.lat}, ${loc.lng})">GO</button>
                <button class="card-btn" onclick="onDeleteLocation(${loc.id})">X</button>
                </div>
            </div>
            ` })
            document.querySelector('.my-locations').innerHTML = strHTML.join('')
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords.latitude, pos.coords.longitude);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// mapService.panTo(35.6895, 139.6917);  //Tokyo
function onPanTo(lat, lng) {
    // console.log('Panning the Map');
    document.querySelector('.btn-copy-location').innerText = 'Copy Location'
    mapService.panTo(lat, lng);
}

function onDeleteLocation(locId) {
    // console.log('Deleting location with id:', locId);
    locService.deleteLocation(locId)
    onGetLocs()
}

function addMapListener() {
    var map = mapService.getMap()
        // console.log(map)
    google.maps.event.addListener(map, 'click', (e) => {
        var position = { lat: e.latLng.lat(), lng: e.latLng.lng() }
        markedPosition = position
        openModal()
        var marker = new google.maps.Marker({
            position,
            map,
            title: "Your location",
            icon: '../img/pin.png'
        });
    });
}

function onSearch() {
    const searchVal = document.querySelector('.search-input').value;
    mapService.searchLocation(searchVal);
}

function searchForParams() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let lat = params.lat
    let lng = params.lng
    console.log('lat, lng', lat, lng);
    if (!lat || !lng) return false
    else onPanTo(lat, lng)
}

function openModal() {
    document.querySelector('.modal').classList.remove('hide');
}

function closeModal() {
    document.querySelector('.modal').classList.add('hide');
}

function onAddLocation() {
    var value = document.querySelector('.location-name-input').value;
    locService.addLocation(value, markedPosition.lat, markedPosition.lng);
    closeModal()
    onGetLocs()
}


function renderWeather(weather) {
    var elWeather = document.querySelector('.weather-container')
    var strHtml = `<section class="weather-title">
        <h3>${weather.name}</h3>
        <div>${weather.main.temp}℃ 
        <span>(feels like: ${weather.main.feels_like})</span>
        </div>
        </section>
   <section class="flex align-center space-around">${weather.desc}
   <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" width="50px" height="50px"></section>
   <section><div>Degrees from ${weather.main.temp_min} to ${weather.main.temp_max}</div>
   <div>Wind ${weather.wind.speed}m/s</div>
   </section>
   <section>${weather.main.humidity}% humidity</section>`
    elWeather.innerHTML = strHtml;


}