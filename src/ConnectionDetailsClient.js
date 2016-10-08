import axios from 'axios';

function getConnections(cb) {
    return axios.get(`/wsitransformer/api/connections/`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createConnection(name, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    console.log(name);
    return axios.post(`/wsitransformer/api/connections/`, '"'+name+'"', config)
        .then(checkStatus);
}

function deleteConnection(name, cb) {
    console.log(name);
    return axios.delete(`/wsitransformer/api/connections/${name}`)
        .then(checkStatus);
}

function getConnectionParams(name, cb) {
    return axios.get(`/wsitransformer/api/connections/${name}`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createConnectionParam(connectionName, paramName, paramValue, cb) {
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios.post(`/wsitransformer/api/connections/${connectionName}/params/`,
        jsonToQueryString({paramName: paramName, paramValue: paramValue}), config)
        .then(checkStatus);
}

function deleteConnectionParam(connectionName, paramName, cb) {
    console.log(name);
    return axios.delete(`/wsitransformer/api/connections/${connectionName}/params/${paramName}`)
        .then(checkStatus);
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

function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

const ConnectionDetailsClient = {
    getConnections,
    getConnectionParams,
    createConnection,
    deleteConnection,
    createConnectionParam,
    deleteConnectionParam
    
};

export default ConnectionDetailsClient;
