import axios from 'axios';


function getVersion(cb) {
    return axios.get(`/wsitransformer/api/discovery/`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function doDiff(version1, version2, cb) {
    console.log("---->"+version1);
    console.log("---->"+version2)

    return axios.post(`/wsitransformer/api/diff/`, jsonToQueryString({versionA: version1, versionB: version2}) )
        .then(checkStatus)
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
function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}


function parseJSON(response) {
    return response.data;
}

const DiffClient = {
    getVersion,
    doDiff

};

export default DiffClient;
