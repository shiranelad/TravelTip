import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    deleteLocation,
    addLocation
}
const STORAGE_KEY = 'userLocsDB'

var gUserLocations = storageService.load(STORAGE_KEY) || []

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gUserLocations);
        }, 1000)
    });
}

function createLocation(name, lat, lng) {
    return {
        id: _makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
    }
}

function addLocation(name, lat, lng) {
    const location = createLocation(name, lat, lng)
    gUserLocations.push(location)
    saveLocationsToStorage()
}

function deleteLocation(locId) {
    var idx = gUserLocations.findIndex(loc => loc.id === locId)
    gUserLocations.splice(idx, 1);
    saveLocationsToStorage()
}

function saveLocationsToStorage() {
    storageService.save(STORAGE_KEY, gUserLocations)
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}