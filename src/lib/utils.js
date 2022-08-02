// @ts-nocheck
export function post(endpoint, data) {
    return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data || {}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result) => result.json());
}

export function setLocalStorage(itemName, itemValue) {
    localStorage.setItem(itemName, itemValue);
};

export function getLocalStorage(itemName) {
    return localStorage.getItem(itemName);
};