import axios from 'axios';

function getNetwork(version, cb) {
    return axios.get(`/wsitransformer/api/discovery/${version}/network`, {
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
        alert(error);
        throw error;
    }
}

function parseJSON(response) {
    return response.data;
}

const DiscoveryGraphClient = {
    getNetwork
};

export default DiscoveryGraphClient;
