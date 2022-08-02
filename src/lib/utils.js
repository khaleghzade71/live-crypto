export function post(endpoint, data) {
    return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data || {}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result) => result.json());
}
