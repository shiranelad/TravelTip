'use strict';
export const storageService = {
    save: saveToStorage,
    load: loadFromStorage,
    delete: deleteFromStorage
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function deleteFromStorage(key) {
    localStorage.removeItem(key)
}