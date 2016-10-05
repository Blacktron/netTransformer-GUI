import fetch from 'isomorphic-fetch';

function getConnections(cb) {
    return fetch(`/wsitransformer/api/connections/`, {
        accept: 'application/json'
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function getConnectionParams(name, cb) {
    return fetch(`/wsitransformer/api/connections/${name}`, {
        accept: 'application/json'
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        console.log(error); // eslint-disable-line no-console
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

const ConnectionDetailsClient = { getConnections, getConnectionParams };
export default ConnectionDetailsClient;