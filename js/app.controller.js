import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;


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
            document.querySelector('.locs').innerText = JSON.stringify(locs)
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
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    // mapService.panTo(35.6895, 139.6917);  //Tokyo
    mapService.panTo(lat, lng);  //Tokyo
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
