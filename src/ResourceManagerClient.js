import axios from 'axios';

function getResourceNames(cb) {
    return axios.get(`/wsitransformer/api/resource/names`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createResourceName(name, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(`/wsitransformer/api/resource/names`, '"'+name+'"', config)
        .then(checkStatus);
}

function deleteResourceName(name, cb) {
    return axios.delete(`/wsitransformer/api/resource/${name}`)
        .then(checkStatus);
}

function getConnectionTypes(resourceName, cb) {
    return axios.get(`/wsitransformer/api/resource/${resourceName}/connection`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createConnectionType(resourceName, connectionType, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(`/wsitransformer/api/resource/${resourceName}/connection`, '"'+connectionType+'"', config)
        .then(checkStatus);
}

function deleteConnectionType(resourceName, connectionType, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.delete(`/wsitransformer/api/resource/${resourceName}/connection/${connectionType}`, config)
        .then(checkStatus);
}

function getConnectionParams(resourceName, connectionType, cb) {
    return axios.get(`/wsitransformer/api/resource/${resourceName}/connection/${connectionType}/param`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createConnectionParam(resourceName, connectionType, paramName, paramValue, cb) {
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios.post(`/wsitransformer/api/resource/${resourceName}/connection/${connectionType}/param`,
        jsonToQueryString({paramName: paramName, paramValue: paramValue}), config)
        .then(checkStatus);
}

function updateConnectionParam(resourceName, connectionType, paramName, paramValue, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.put(`/wsitransformer/api/resource/${resourceName}/connection/${connectionType}/param/${paramName}`,'"'+paramValue+'"', config)
        .then(checkStatus);
}

function deleteConnectionParam(resourceName, connectionType, paramName, cb) {
    return axios.delete(`/wsitransformer/api/resource/${resourceName}/connection/${connectionType}/param/${paramName}`)
        .then(checkStatus);
}

function getSelectionParams(resourceName, cb) {
    return axios.get(`/wsitransformer/api/resource/${resourceName}/selection/param`, {
    }).then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function createSelectionParam(resourceName, paramName, paramValue, cb) {
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    return axios.post(`/wsitransformer/api/resource/${resourceName}/selection/param`,
        jsonToQueryString({paramName: paramName, paramValue: paramValue}), config)
        .then(checkStatus);
}

function updateSelectionParam(resourceName, paramName, paramValue, cb) {
    const config = { headers: { 'Content-Type': 'application/json' } };
    return axios.put(`/wsitransformer/api/resource/${resourceName}/selection/param/${paramName}`,'"'+paramValue+'"', config)
        .then(checkStatus);
}

function deleteSelectionParam(resourceName, paramName, cb) {
    return axios.delete(`/wsitransformer/api/resource/${resourceName}/selection/param/${paramName}`)
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

function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

const ResourceManagerClient = {
    getResourceNames,
    createResourceName,
    deleteResourceName,
    getConnectionParams,
    createConnectionParam,
    deleteConnectionParam,
    updateConnectionParam,
    getConnectionTypes,
    createConnectionType,
    deleteConnectionType,
    getSelectionParams,
    createSelectionParam,
    updateSelectionParam,
    deleteSelectionParam
};

export default ResourceManagerClient;
