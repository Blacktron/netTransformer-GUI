import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import VersionClient from './VersionClient';

class NetDiscovererBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div className="NetDiscovererBox"  style={this.props.style}>
                <Discoverer client={this.props.client} pollInterval={this.props.pollInterval}>
                </Discoverer>
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
        var self = this;
        VersionClient.createVersion(function (version) {
            console.log("here");
            self.props.client.createDiscoverer(version.data);
            self.setState({version: version.data, discoveryStatus: null});
        });


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
        var style = {
            margin: 4
        };
        return (
        <div className="Version_props">
            <b>Discovery Status: {this.state.discoveryStatus}</b><br/>
            <b>Discovery Version: {this.state.version}</b><br/>
            <RaisedButton label="Start"
                          style={style}
                          disabled={this.state.discoveryStatus !== null}
                          onClick={this.startDiscovery.bind(this)}
            />
            <RaisedButton label={this.state.discoveryStatus === "PAUSED" ? "Resume" : "Pause"}
                          style={style}
                          disabled={this.state.discoveryStatus !== "STARTED" && this.state.discoveryStatus !== "PAUSED"}
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
