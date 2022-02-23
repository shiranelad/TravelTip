import { storageService } from './storage.service.js'


export const locService = {
    getLocs,
    deleteLocation
}
const STORAGE_KEY = 'userLocsDB'
var globalId = 100;


// var gUserLocations = storageService.load(STORAGE_KEY) || []
var gUserLocations = [
    createLocation('My Home', 31.79346180394652, 35.16714360932752),
    createLocation('Tel Aviv', 32.07341332725964, 34.790386152863825),
    createLocation('Tel Aviv', 32.07341332725964, 34.790386152863825),
    createLocation('Tel Aviv', 32.07341332725964, 34.790386152863825)
]
console.log('gUserLocations', gUserLocations);




// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gUserLocations);
        }, 1000)
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

function deleteLocation(locId) {
    var idx = gUserLocations.findIndex(loc => loc.id === locId)
    gUserLocations.splice(idx, 1);
    saveLocationsToStorage()
}

function saveLocationsToStorage() {
    storageService.save(STORAGE_KEY, gUserLocations)
}