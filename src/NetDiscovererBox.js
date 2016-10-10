import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import RaisedButton from 'material-ui/RaisedButton';

class NetDiscovererBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    versionListChanged = (name) => {
        this.refs.discoverer.loadDiscovererFromServer(name);
    };
    render() {
        return (
            <div className="ConnectionDetailsBox">
                <VersionList client={this.props.client} pollInterval={this.props.pollInterval} onChange={this.versionListChanged.bind(this)}>
                </VersionList>
                <Discoverer client={this.props.client} pollInterval={this.props.pollInterval} ref="discoverer">
                </Discoverer>
            </div>
        )
    }
}

class VersionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: []
        };
        // Functions must be bound manually with ES6 classes
        this.loadVersionsFromServer = this.loadVersionsFromServer.bind(this);
    }
    loadVersionsFromServer(){
        this.props.client.getVersions((versions) => {
            var arr = Object.keys(versions).map(function(k) { return {name: versions[k] }});
            this.setState({
                versions: arr
            });
        });
    }
    componentDidMount() {
        this.loadVersionsFromServer();
    }

    handleRequestChange = (event) => {
        this.props.onChange(event.name);
    };

    onInsertRow() {
        var self = this;
	    this.props.client.createVersion(function (version) {
            self.state.versions.push({name: version.data});
            // self.refs.table.handleAddRow(version);
            self.props.onChange();
            self.setState({versions: self.state.versions});
        });
    };

    onDeleteRow() {
        var rowKeys = this.refs.table.state.selectedRowKeys;
        var self = this;
        if (rowKeys.length === 1) {
            var version = rowKeys[0].trim();
            this.props.client.deleteVersion(version);
            var versions = this.state.versions;
            for(var i = versions.length - 1; i >= 0; i--) {
                if(versions[i].name === version) {
                    versions.splice(i, 1);
                }
            }
            self.props.onChange();
            self.setState({versions: versions});
        }
    };

    render() {
        var selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            onSelect: this.handleRequestChange
        };

        return (
            <div className="Version_names">
                <b>Versions</b>
                <div className="react-bs-table-container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-8">
                            <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-info react-bs-table-add-btn" onClick={this.onInsertRow.bind(this)} type="button">
                                    <i className="glyphicon glyphicon-plus"/> Add
                                </button>
                                <button className="btn btn-warning react-bs-table-del-btn" onClick={this.onDeleteRow.bind(this)} type="button">
                                    <i className="glyphicon glyphicon-trash"/> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                    <BootstrapTable data={this.state.versions}
                                    striped={true}
                                    hover={true}
                                    insertRow={false}
                                    deleteRow={false}
                                    selectRow={selectRowProp}
                                    ref="table"
                    >
                        <TableHeaderColumn isKey={true} dataField="name">Version</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

class Discoverer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: null,
            discoveryStatus: null
        };
        // Functions must be bound manually with ES6 classes
        this.loadDiscovererFromServer = this.loadDiscovererFromServer.bind(this);
    };

    loadDiscovererFromServer(version){
        if (version !=  null) {
            this.props.client.getDiscoverer(version, (status) => {
                this.setState({
                    version: version,
                    discoveryStatus: (status === "" ? null: status)
                });
            });
        } else {
            this.setState({
                version: null,
                discoveryStatus: null
            });
        }
    };
    refresh2(){
        this.loadDiscovererFromServer(this.state.version);
    }
    componentDidMount() {
        this.refresh2();
        this.timer = setInterval(this.refresh2.bind(this), this.props.pollInterval);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startDiscovery(){
        this.props.client.createDiscoverer(this.state.version);
    }
    pauseDiscovery(){
        this.props.client.updateDiscoverer(this.state.version, "PAUSE");
    }
    resumeDiscovery(){
        this.props.client.updateDiscoverer(this.state.version, "RESUME");
    }
    stopDiscovery(){
        this.props.client.deleteDiscoverer(this.state.version);
    }

    render() {
        var visibility = this.state.version == null ? 'hidden' : 'visible';
        const style = {
            margin: 12
        };
        return (
        <div className="Version_props" style={{visibility: visibility}}>
            <b>Discovery Status: {this.state.discoveryStatus}</b><br/>
            <RaisedButton label="Start"
                          style={style}
                          disabled={this.state.discoveryStatus !== null}
                          onClick={this.startDiscovery.bind(this)}
            />
            <RaisedButton label={this.state.discoveryStatus === "PAUSED" ? "Resume" : "Pause"}
                          style={style}
                          disabled={this.state.discoveryStatus !== "STARTED" || this.state.discoveryStatus !== "PAUSED"}
                          onClick={this.state.discoveryStatus === "PAUSED" ?
                          this.resumeDiscovery.bind(this) : this.pauseDiscovery.bind(this)}
            />
            <RaisedButton label="Stop"
                          style={style}
                          disabled={this.state.discoveryStatus !== "STARTED"}
                          onClick={this.stopDiscovery.bind(this)}
            />
        </div>
        )
    }
}

export default NetDiscovererBox;
