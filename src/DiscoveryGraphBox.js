import {default as React, Component} from 'react';
import VersionClient from './VersionClient';
import DiscoveryGraphClient from './DiscoveryGraphClient';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


const vis = require('vis');
const uuid = require('uuid');

class DiscoveryGraphBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    versionListChanged = (version) => {
        this.refs.discoveryGraph.loadGraphFromServer(version);
    };

    render() {
        return (
            <div className="DiscoveryGraphBox">
                <VersionList onChange={this.versionListChanged.bind(this)}>
                </VersionList>
                <DiscoveryGraph ref="discoveryGraph">
                </DiscoveryGraph>
            </div>
        );
    }
}


class VersionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: [],
            version: null
        };
        // Functions must be bound manually with ES6 classes
        this.loadVersionsFromServer = this.loadVersionsFromServer.bind(this);
    }

    loadVersionsFromServer() {
        VersionClient.getVersions((versions) => {
            var arr = Object.keys(versions).map(function (k) {
                return {name: versions[k]}
            });
            this.setState({
                versions: arr,
                version: null
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
        VersionClient.createVersion(function (version) {
            self.state.versions.push({name: version.data});
            // self.refs.table.handleAddRow(version);
            self.setState({versions: self.state.versions, version: version.data});
            self.props.onChange(version.data);
        });
    };

    onDeleteRow() {
        var rowKeys = this.refs.table.state.selectedRowKeys;
        var self = this;
        if (rowKeys.length === 1) {
            var version = rowKeys[0].trim();
            VersionClient.deleteVersion(version);
            var versions = this.state.versions;
            for (var i = versions.length - 1; i >= 0; i--) {
                if (versions[i].name === version) {
                    versions.splice(i, 1);
                }
            }
            self.props.onChange(null);
            self.setState({versions: versions, version: null});
        }
    };

    render() {
        var selectRowProp = {
            mode: "radio",
            clickToSelect: true,
            bgColor: "rgb(238, 193, 213)",
            selected: [this.state.version],
            onSelect: this.handleRequestChange
        };

        return (
            <div className="Version_names">
                <b>Versions</b>
                <div className="react-bs-table-container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-8">
                            <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-info react-bs-table-add-btn"
                                        onClick={this.onInsertRow.bind(this)} type="button">
                                    <i className="glyphicon glyphicon-plus"/> Add
                                </button>
                                <button className="btn btn-warning react-bs-table-del-btn"
                                        onClick={this.onDeleteRow.bind(this)} type="button">
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


class DiscoveryGraph extends Component {
    constructor(props) {
        super(props);
        const {identifier} = this.props;
        this.updateGraph = this.updateGraph.bind(this);
        this.state = {
            network: {nodes: [], edges: []},
            hierarchicalLayout: true,
            identifier: identifier ? identifier : uuid.v4()
        };
    }

    loadGraphFromServer(version){
        if (version !=  null) {
            DiscoveryGraphClient.getNetwork(version, (network) => {
                var nodes = Object.keys(network.graphmlNodes).map(function(k) {
                    return {id: network.graphmlNodes[k].id, label: network.graphmlNodes[k].id}
                });
                var edges = Object.keys(network.graphmlEdges).map(function(k) {
                    return {from: network.graphmlEdges[k].fromNode, to: network.graphmlEdges[k].toNode}
                });

                this.setState({
                    network: {nodes: nodes, edges: edges},
                    hierarchicalLayout: this.state.hierarchicalLayout,
                    identifier: this.state.identifier
                });
            });
        } else {
            this.setState({
                network: {nodes: [], edges: []},
                hierarchicalLayout: this.state.hierarchicalLayout,
                identifier: this.state.identifier
            });
        }
    };

    componentDidMount() {
        this.updateGraph();
    }

    componentDidUpdate() {
        this.updateGraph();
    }

    updateGraph() {
        let container = document.getElementById(this.state.identifier);
        let options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            stabilize: false,
            smoothCurves: false,
            edges: {
                color: '#000000',
                width: 0.5,
                arrowScaleFactor: 0.5,
                style: 'arrow'
            }
        };

        if (this.state.hierarchicalLayout) {
            options.hierarchicalLayout = {
                enabled: true,
                direction: 'UD',
                levelSeparation: 100,
                nodeSpacing: 1
            };
        } else {
            options.hierarchicalLayout = {
                enabled: false
            };
        }
        container.style.height = '600px';
        new vis.Network(container, this.state.network, options);
    }

    render() {
        const {identifier} = this.state;
        return (
            <div id={identifier}>
            </div>
        );
    }
}

DiscoveryGraph.defaultProps = {
    graph: {},
    style: {width: '640px', height: '480px'}
};

export default DiscoveryGraphBox;