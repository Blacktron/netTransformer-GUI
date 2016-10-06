import React, { Component } from 'react';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class ConnectionDetailsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    connectionListChanged = (name) => {
        this.refs.params.loadConnectionParamsFromServer(name);
    };
    render() {
        return (
            <div className="ConnectionDetailsBox">
                <ConnectionDetailsList client={this.props.client} pollInterval={this.props.pollInterval} onChange={this.connectionListChanged.bind(this)}>
                </ConnectionDetailsList>
                <ConnectionDetailsParams client={this.props.client} pollInterval={this.props.pollInterval} ref="params">
                </ConnectionDetailsParams>
            </div>
        )
    }
}

class ConnectionDetailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conn: []
        };
        // Functions must be bound manually with ES6 classes
        this.loadConnectionDetailFromServer = this.loadConnectionDetailFromServer.bind(this);
    }
    loadConnectionDetailFromServer(){
        this.props.client.getConnections((conn) => {
            var arr = Object.keys(conn).map(function(k) { return {name: k }});
            this.setState({
                conn: arr
            });
        });
    }
    componentDidMount() {
        this.loadConnectionDetailFromServer();
        setInterval(this.loadConnectionDetailFromServer, this.props.pollInterval);
    }

    handleRequestChange = (event) => {
        this.props.onChange(event.name);
    };
    render() {
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            afterSaveCell: onAfterSaveCell
        };
        var selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            onSelect: this.handleRequestChange
        };

        return (
            <div className="connectionDetails_names">
                <b>Connection Name</b>
                <BootstrapTable  data={this.state.conn}
                                striped={true}
                                hover={true}
                                cellEdit={cellEditProp}
                                insertRow={true}
                                deleteRow={true}
                                selectRow={selectRowProp}
                >
                    <TableHeaderColumn isKey={true} dataField="name">Name</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

class ConnectionDetailsParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connParams: {connectionType: "", params: []}
        };
        // Functions must be bound manually with ES6 classes
        this.loadConnectionParamsFromServer = this.loadConnectionParamsFromServer.bind(this);
    };

    loadConnectionParamsFromServer(connName){
        this.props.client.getConnectionParams(connName, (connParams) => {
            var arr = Object.keys(connParams.params).map(function(k) { return { name: k, value: connParams.params[k] }});
            this.setState({
                connParams: {connectionType: connParams.connectionType, params: arr}
            });
        });
    };

    render() {
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            afterSaveCell: onAfterSaveCell
        };
        var selectRowProp = {
            mode: "checkbox",
            clickToSelect: true
        };
        return (
        <BootstrapTable data={this.state.connParams.params}
                        striped={true}
                        hover={true}
                        cellEdit={cellEditProp}
                        insertRow={true}
                        deleteRow={true}
                        selectRow={selectRowProp}
            >
            <TableHeaderColumn isKey={true} dataField="name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="value">Value</TableHeaderColumn>
        </BootstrapTable>
        )
    }
}
function onAfterSaveCell(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.log(row);
}
export default ConnectionDetailsBox;
