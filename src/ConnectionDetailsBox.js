import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class ConnectionDetailsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    connectionListChanged = (name) => {
        if (name != null) {
            this.refs.params.loadConnectionParamsFromServer(name);
        } else {
            this.refs.params.hide();
        }
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
        //setInterval(this.loadConnectionDetailFromServer, this.props.pollInterval);
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
	    this.props.client.createConnection(row.name.trim());
        this.props.onChange();
    };

    onAfterDeleteRow(rowKeys) {
        for (var i = 0; i < rowKeys.length; i++) {
            this.props.client.deleteConnection(rowKeys[i].trim());
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
            <div className="connectionDetails_names">
                <b>Connection Name</b>
                <BootstrapTable  data={this.state.conn}
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

class ConnectionDetailsParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: 'hidden',
            connName: null,
            connParams: {connectionType: "", params: []}
        };
        // Functions must be bound manually with ES6 classes
        this.loadConnectionParamsFromServer = this.loadConnectionParamsFromServer.bind(this);
    };

    loadConnectionParamsFromServer(connName){
        this.props.client.getConnectionParams(connName, (connParams) => {
            if (connParams.params != null) {
                var arr = Object.keys(connParams.params).map(function (k) {
                    return {name: k, value: connParams.params[k]}
                });
                this.setState({
                    visibility: 'visible',
                    connName: connName,
                    connParams: {connectionType: connParams.connectionType, params: arr}
                });
            } else {
                this.setState({
                    visibility: 'visible',
                    connName: connName,
                    connParams: {connectionType: null, params: []}
                });
            }
        });
    };

    hide() {
        var state = this.state;
        state.visibility='hidden';
        this.setState(state);
    };

    show() {
        var state = this.state;
        state.visibility='visible';
        this.setState(state);
    };

    beforeSaveCell(row, cellName, cellValue){
        console.log("Before Save cell '"+cellName+"' with value '"+cellValue+"'");
        console.log("Thw whole row :");
        console.log(row);
    };

    onAfterSaveCell(row, cellName, cellValue){
        console.log("After Save cell '"+cellName+"' with value '"+cellValue+"'");
        console.log("Thw whole row :");
        console.log(row);
    };

    onAfterInsertRow(row) {
        this.props.client.createConnectionParam(this.state.connName, row.name.trim(), row.value.trim());
    };

    onAfterDeleteRow(rowKeys) {
        for (var i = 0; i < rowKeys.length; i++) {
            this.props.client.deleteConnectionParam(this.state.connName, rowKeys[i].trim());
        }
    };
    
    onConnectionTypeChange(event) {
        var state = this.state;
        state.connParams.connectionType=event.value;
        this.setState(state);
    };

    render() {
        var options = {
            afterDeleteRow: this.onAfterDeleteRow.bind(this),
            afterInsertRow: this.onAfterInsertRow.bind(this)
        };
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            beforeSaveCell: this.beforeSaveCell.bind(this),
            afterSaveCell: this.onAfterSaveCell
        };
        var selectRowProp = {
            mode: "checkbox",
            clickToSelect: true
        };
        var selectOptions = [
            { value: 'ssh', label: 'ssh' },
            { value: 'snmp', label: 'snmp' }
        ];

        return (
        <div className="connectionDetails_props" style={{visibility: this.state.visibility}}>
            <b>Connection type</b>
            <Select
                name="form-field-name"
                value={this.state.connParams.connectionType}
                options={selectOptions}
                onChange={this.onConnectionTypeChange.bind(this)}
            />
            <br/>
               <b>Connection params</b>
               <BootstrapTable data={this.state.connParams.params}
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

export default ConnectionDetailsBox;
