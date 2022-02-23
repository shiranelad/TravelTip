import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;
window.onSearch = onSearch;

var currPosition = {}

function onInit() {
    mapService.initMap()
        .then(() => {
            addMapListener()
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 }); //Kfar Sirkin
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
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
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// mapService.panTo(35.6895, 139.6917);  //Tokyo
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    currPosition = { lat, lng }
    document.querySelector('.btn-copy-location').innerText = 'Copy Location'
    mapService.panTo(lat, lng); //Tokyo
}

function onDeleteLocation(locId) {
    console.log('Deleting location with id:', locId);
    locService.deleteLocation(locId)
    onGetLocs()
}
//Shiran
function addMapListener() {
    var map = mapService.getMap()
    console.log(map)
    google.maps.event.addListener(map, 'click', (e) => {
        var position = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            // var locName = prompt('Enter a name for your location')
            // if (!locName) return
        onPanTo(position.lat, position.lng)
            // var marker = new google.maps.Marker({
            //     position: { lat, lng },
            //     map,
            //     title: "Your location",
            // });
    });
}

function onSearch() {
    const searchVal = document.querySelector('.search-input').value;
    // var map = getMap()
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

function onSaveLocation() {
    var url = `https://github.io/me/travelTip/index.html?lat=${currPosition.lat}&lng=${currPosition.lng}`
    navigator.clipboard.writeText(url)
    document.querySelector('.btn-copy-location').innerText = 'Copied!'
}