import axios from 'axios';

function getConnections(cb) {
    return axios.get(`/wsitransformer/api/connections/`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createConnection(name, cb) {
    return axios.post(`/wsitransformer/api/connections/`, '"'+name+'"'
    ).then(checkStatus);
}

function getConnectionParams(name, cb) {
    return axios.get(`/wsitransformer/api/connections/${name}`, {
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
        console.log("---->"+error); // eslint-disable-line no-console
        throw error;
    }
}

function parseJSON(response) {
    return response.data;
}

const ConnectionDetailsClient = { getConnections, getConnectionParams, createConnection };
export default ConnectionDetailsClient;
