import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import 'react-select/dist/react-select.css';

class ResourceManagerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    resourceListChanged = (name) => {
        this.refs.params.loadConnectionTypeAndParamsFromServer(name);
    };
    render() {
        return (
            <div className="ResourceManagerBox">
                <ResourceList client={this.props.client} pollInterval={this.props.pollInterval} onChange={this.resourceListChanged.bind(this)}>
                </ResourceList>
                <ResourceConnectionParams client={this.props.client} pollInterval={this.props.pollInterval} ref="params">
                </ResourceConnectionParams>
            </div>
        )
    }
}

class ResourceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resource: []
        };
        // Functions must be bound manually with ES6 classes
        this.loadResourceFromServer = this.loadResourceFromServer.bind(this);
    }
    loadResourceFromServer(){
        this.props.client.getResource((resource) => {
            var arr = Object.keys(resource).map(function(k) { return {name: resource[k] }});
            this.setState({
                resource: arr
            });
        });
    }
    componentDidMount() {
        this.loadResourceFromServer();
        //setInterval(this.loadResourceFromServer, this.props.pollInterval);
    }

    handleRequestChange = (event) => {
        this.props.onChange(event.name);
    };

    // currently it is not used, because can not edin key column
    onAfterSaveCell(row, cellName, cellValue){
        console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
        console.log("Thw whole row :");
        console.log(row);
    };

    onAfterInsertRow(row) {
	    this.props.client.createResource(row.name.trim());
        this.props.onChange();
    };

    onAfterDeleteRow(rowKeys) {
        for (var i = 0; i < rowKeys.length; i++) {
            this.props.client.deleteResource(rowKeys[i].trim());
        }
        this.props.onChange();
    };

    render() {
        var options = {
            afterDeleteRow: this.onAfterDeleteRow.bind(this),
            afterInsertRow: this.onAfterInsertRow.bind(this)
        };
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            afterSaveCell: this.onAfterSaveCell.bind(this)
        };
        var selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            onSelect: this.handleRequestChange
        };

        return (
            <div className="ResourceManager_names">
                <b>Resource Name</b>
                <BootstrapTable  data={this.state.resource}
                                striped={true}
                                hover={true}
                                cellEdit={cellEditProp}
                                insertRow={true}
                                deleteRow={true}
                                selectRow={selectRowProp}
			                    options={ options }
                >
                    <TableHeaderColumn isKey={true} dataField="name">Name</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

class ResourceConnectionParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceName: null,
            connectionTypes: [],
            connParams: {connectionType: "", params: []}
        };
        // Functions must be bound manually with ES6 classes
        this.loadConnectionParamsFromServer = this.loadConnectionParamsFromServer.bind(this);
    };

    loadConnectionTypeAndParamsFromServer(resourceName){
        if (resourceName != null) {
            this.props.client.getConnectionTypes(resourceName, (connTypes) => {
                if (connTypes.length > 0) {
                    var connType = connTypes[0];
                    this.loadConnectionParamsFromServer(resourceName, connTypes, connType);
                } else {
                    this.setState({
                        resourceName: resourceName,
                        connectionTypes: [],
                        connParams: {connectionType: "", params: []}
                    });
                }
            });
        } else {
            this.setState({
                resourceName: null,
                connectionTypes: [],
                connParams: {connectionType: null, params: []}
            });
        }
    };

    loadConnectionParamsFromServer(resourceName, connTypes, connType){
        this.props.client.getConnectionParams(resourceName, connType, (connParams) => {
            if (connParams != null) {
                var arr = Object.keys(connParams).map(function (k) {
                    return {name: connParams[k].name, value: connParams[k].value}
                });
                this.setState({
                    resourceName: resourceName,
                    connectionTypes: connTypes,
                    connParams: {connectionType: connType, params: arr}
                });
            } else {
                this.setState({
                    resourceName: resourceName,
                    connectionTypes: connTypes,
                    connParams: {connectionType: connType, params: []}
                });
            }
        });
    };

    beforeSaveCell(row, cellName, cellValue){
        console.log("Before Save cell '"+cellName+"' with value '"+cellValue+"'");
        console.log("Thw whole row :");
        console.log(row);
        this.props.client.updateConnectionParam(this.state.resourceName, this.state.connParams.connectionType, row.name, cellValue);
    };

    onAfterInsertRow(row) {
        this.props.client.createConnectionParam(this.state.resourceName, this.state.connParams.connectionType, row.name.trim(), row.value.trim());
    };

    onAfterDeleteRow(rowKeys) {
        for (var i = 0; i < rowKeys.length; i++) {
            this.props.client.deleteConnectionParam(this.state.resourceName, this.state.connParams.connectionType, rowKeys[i].trim());
        }
    };

    onConnTypeAfterInsertRow(row) {
        var connType = row.value.trim();
        this.props.client.createConnectionType(this.state.resourceName, connType);
        var connTypes = this.state.connectionTypes;
        connType.push(connType);
        this.setState({
            resourceName: this.state.resourceName,
            connectionTypes: connTypes,
            connParams: {connectionType: connType, params: []}
        });
    };

    onConnTypeAfterDeleteRow(rowKeys) {
        for (var j = 0; j < rowKeys.length; j++) {
            var connType = rowKeys[j].trim();
            this.props.client.deleteConnectionType(this.state.resourceName, connType);
            var connTypes = this.state.connectionTypes;
            for(var i = connTypes.length - 1; i >= 0; i--) {
                if(connTypes[i] === connType) {
                    connTypes.splice(i, 1);
                }
            }
            this.setState({
                resourceName: this.state.resourceName,
                connectionTypes: connTypes,
                connParams: {connectionType: null, params: []}
            });
        }
    };

    onConnectionTypeChange(event) {
        this.loadConnectionParamsFromServer(this.state.resourceName, this.state.connectionTypes, event.value);
    };


    render() {
        var options = {
            afterDeleteRow: this.onAfterDeleteRow.bind(this),
            afterInsertRow: this.onAfterInsertRow.bind(this)
        };
        var connTypeOptions = {
            afterDeleteRow: this.onConnTypeAfterDeleteRow.bind(this),
            afterInsertRow: this.onConnTypeAfterInsertRow.bind(this)
        };
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            beforeSaveCell: this.beforeSaveCell.bind(this)
        };
        var sconnTypeSelectRowProp = {
            mode: "radio",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            selected: [this.state.connParams.connectionType],
            onSelect: this.onConnectionTypeChange.bind(this)
        };
        var selectRowProp = {
            mode: "checkbox",
            clickToSelect: true
        };
        var connectionTypes = this.state.connectionTypes;
        var connectionTypesArr = Object.keys(connectionTypes).map(function (k) {
            return {value: connectionTypes[k]}
        });
        var visibility = this.state.resourceName == null ? 'hidden' : 'visible';
        var tableVisibility = this.state.connectionTypes.length === 0 ? 'hidden' : 'visible';

        return (
        <div className="ResourceManager_props" style={{visibility: visibility}}>
            <BootstrapTable data={connectionTypesArr}
                            striped={true}
                            hover={true}
                            insertRow={true}
                            deleteRow={true}
                            selectRow={sconnTypeSelectRowProp}
                            options={ connTypeOptions }
            >
                <TableHeaderColumn isKey={true} dataField="value">Connection type</TableHeaderColumn>
            </BootstrapTable>
            <br/>
               <b>Connection params</b>
               <BootstrapTable data={this.state.connParams.params}
                    style={{visibility: tableVisibility}}
                    striped={true}
                    hover={true}
                    cellEdit={cellEditProp}
                    insertRow={true}
                    deleteRow={true}
                    selectRow={selectRowProp}
                    options={ options }
                >
                <TableHeaderColumn isKey={true} dataField="name">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="value">Value</TableHeaderColumn>
            </BootstrapTable>
        </div>
        )
    }
}

export default ResourceManagerBox;
