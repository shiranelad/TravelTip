import { storageService } from './storage.service.js'


export const locService = {
    getLocs
}
const STORAGE_KEY = 'userLocsDB'
var gUserLocations = storageService.load(STORAGE_KEY) || []

var globalId = 100;

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

//TODO - create an ID, fix the Weather key and update UpdatedAt
function createLocation(name, lat, lng) {
    return {
        id: globalId++,
        name,
        lat,
        lng,
        weather: 'winter',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function addLocation(name, lat, lng) {
    const location = createLocation(name, lat, lng)
    gUserLocations.push(location)
}

function saveLocationsToStorage() {
    storageService.save(STORAGE_KEY, gUserLocations)
}