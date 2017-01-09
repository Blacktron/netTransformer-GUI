import axios from 'axios';


function getVersion(cb) {
    return axios.get(`/wsitransformer/api/discovery/`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function doDiff(cb) {

    const versionA = "version1";
    const versionB = "version2";
    console.log("---->"+versionA); // eslint-disable-line no-console
    console.log("---->"+versionB)

    return axios.post(`/wsitransformer/api/diff/`, '"'+versionA+'"','"'+versionB+'"' )
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

function parseJSON(response) {
    return response.data;
}

const DiffClient = {
    getVersion,
    doDiff

};

export default DiffClient;
