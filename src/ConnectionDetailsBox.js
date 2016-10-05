import React, { Component, PropTypes } from 'react';

import {List, ListItem, MakeSelectable} from 'material-ui/List';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


let SelectableList = MakeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index
            });
            this.props.onChange(event, index)
        };
        render() {
            return (
                <ComposedComponent value={this.state.selectedIndex} onChange={this.handleRequestChange}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

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
            <div className="connectionDetails">
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
            this.setState({
                conn: Object.keys(conn)
            });
        });
    }
    componentDidMount() {
        this.loadConnectionDetailFromServer();
        setInterval(this.loadConnectionDetailFromServer, this.props.pollInterval);
    }
    handleRequestChange = (event, index) => {
        this.props.onChange(this.state.conn[index]);
    };
    render() {
        return (
            <div className="connectionDetails_names">
                <b>Connection Name</b>
                <SelectableList defaultValue={0} onChange={this.handleRequestChange}>
                    {
                        this.state.conn.map((conn, idx) => (
                            <ListItem primaryText={conn} key={conn} value={idx}/>
                        ))
                    }
                </SelectableList>
            </div>
        )
    }
}

class ConnectionDetailsParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connParams: {params: []}
        };
        // Functions must be bound manually with ES6 classes
        this.loadConnectionParamsFromServer = this.loadConnectionParamsFromServer.bind(this);
    };

    loadConnectionParamsFromServer(connName){
        this.props.client.getConnectionParams(connName, (connParams) => {
            this.setState({
                connParams: connParams
            });
        });
    };

    render() {
        return (
            <div className="connectionDetails_props">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Value</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            Object.keys(this.state.connParams.params).map(key => (
                                <TableRow key={key}>
                                    <TableRowColumn>{key}</TableRowColumn>
                                    <TableRowColumn>{this.state.connParams.params[key]}</TableRowColumn>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        )
    }
}
export default ConnectionDetailsBox;
