import axios from 'axios';

function getVersions(cb) {
    return axios.get(`/wsitransformer/api/discovery/`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createVersion(cb) {
    return axios.post(`/wsitransformer/api/discovery/`)
        .then(checkStatus)
        .then(cb)
}

function deleteVersion(version, cb) {
    return axios.delete(`/wsitransformer/api/discovery/${version}`)
        .then(checkStatus);
}

function getDiscoverer(version, cb) {
    return axios.get(`/wsitransformer/api/discovery/${version}/discoverer`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createDiscoverer(version, cb) {
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios.post(`/wsitransformer/api/discovery/${version}/discoverer/`, config)
        .then(checkStatus);
}

function updateDiscoverer(version, operation, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.put(`/wsitransformer/api/discovery/${version}/discoverer/`,'"'+operation+'"', config)
        .then(checkStatus);
}

function deleteDiscoverer(version, cb) {
    return axios.delete(`/wsitransformer/api/discovery/${version}/discoverer/`)
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
        alert(error);
        throw error;
    }
}

function parseJSON(response) {
    return response.data;
}

const ConnectionDetailsClient = {
    getVersions,
    createVersion,
    deleteVersion,
    getDiscoverer,
    createDiscoverer,
    updateDiscoverer,
    deleteDiscoverer
};

export default ConnectionDetailsClient;
