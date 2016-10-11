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
        .then(cb);
}

function deleteVersion(version, cb) {
    return axios.delete(`/wsitransformer/api/discovery/${version}`)
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

const VersionClient = {
    getVersions,
    createVersion,
    deleteVersion
};

export default VersionClient;
