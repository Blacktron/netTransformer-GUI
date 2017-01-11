import {default as React, Component} from 'react';
//import VersionClient from './VersionClient';
import DiscoveryGraphClient from './DiscoveryGraphClient';
//import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
//import {Grid, Row, Col} from 'react-bootstrap';
import {Tabs, Tab} from 'material-ui/Tabs';
//import RefreshIndicator from 'material-ui/RefreshIndicator';

const vis = require('vis');
const uuid = require('uuid');

class DiscoveryGraphBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            currentTabIndex: -1
        };
    }

    handleOpenGraph = (version) => {
        let tabs = this.state.tabs;
        tabs.push({label: version, version: version});
        this.setState({tabs: tabs, currentTabIndex: (tabs.length - 1)});
    };

    handleCloseGraph() {
        let tabs = this.state.tabs;
        tabs.splice(this.state.currentTabIndex, 1);
        this.setState({tabs: tabs, currentTabIndex: (0)});

    }

    tabClicked(i) {
        this.setState({tabs: this.state.tabs, currentTabIndex: i});
    }

    render() {
        let tabs = [];
        for (let i = 0; i < this.state.tabs.length; i++) {
            tabs.push(
                <Tab label={`${this.state.tabs[i].label}`} value={i} key={i} onActive={this.tabClicked.bind(this,i)}>
                    <DiscoveryGraph version={`${this.state.tabs[i].version}`} style={this.props.style}/>
                </Tab>
            )
        }
        return (
            <Tabs style={this.props.style} value={this.state.currentTabIndex}>
                {tabs}
            </Tabs>
        );
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
            identifier: identifier ? identifier : uuid.v4(),
            updated: false,
            loading: true
        };
    }

    loadGraphFromServer() {
        this.setState({loading: true});
        let version = this.props.version;
        if (version != null) {
            DiscoveryGraphClient.getNetwork(version, (network) => {
                var nodes = Object.keys(network.vertices).map(function (k) {
                    var image = null;
                    if (network.vertices[k].icons.length > 0) {
                        image = '/wsitransformer/api/topology_viewer/config' + network.vertices[k].icons[0].name
                    }
                    return {
                        id: network.vertices[k].id,
                        label: network.vertices[k].id,
                        shape: 'image',
                        image: image
                    }
                });
                var edges = Object.keys(network.edges).map(function (k) {
                    return {from: network.edges[k].fromVertex, to: network.edges[k].toVertex}
                });

                this.setState({
                    network: {nodes: nodes, edges: edges},
                    hierarchicalLayout: this.state.hierarchicalLayout,
                    identifier: this.state.identifier,
                    updated: false,
                    loading: false
                });
            });
        } else {
            this.setState({
                network: {nodes: [], edges: []},
                hierarchicalLayout: this.state.hierarchicalLayout,
                identifier: this.state.identifier,
                updated: false,
                loading: false
            });
        }
    };

    componentDidMount() {
        this.loadGraphFromServer();
        // this.updateGraph();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState.updated;
    }

    componentDidUpdate() {
        this.updateGraph();
        this.state.updated = true;
    }

    updateGraph() {
        let container = document.getElementById(this.state.identifier);
        let options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            nodes: {
                borderWidth: 1,
                borderWidthSelected: 2,
                brokenImage: undefined,
                color: {
                    border: '#2B7CE9',
                    background: '#97C2FC',
                    highlight: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    },
                    hover: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    }
                },
                fixed: {
                    x: false,
                    y: false
                },
                font: {
                    color: '#343434',
                    size: 14, // px
                    face: 'arial',
                    background: 'none',
                    strokeWidth: 0, // px
                    strokeColor: '#ffffff',
                    align: 'center'
                },
                group: undefined,
                hidden: false,
                icon: {
                    face: 'FontAwesome',
                    size: 50,  //50,
                    color: '#2B7CE9'
                },
                image: undefined,
                label: undefined,
                labelHighlightBold: true,
                level: undefined,
                mass: 1,
                physics: true,
                scaling: {
                    min: 10,
                    max: 30,
                    label: {
                        enabled: false,
                        min: 14,
                        max: 30,
                        maxVisible: 30,
                        drawThreshold: 5
                    },
                    customScalingFunction: function (min, max, total, value) {
                        if (max === min) {
                            return 0.5;
                        }
                        else {
                            let scale = 1 / (max - min);
                            return Math.max(0, (value - min) * scale);
                        }
                    }
                },
                shadow: {
                    enabled: false,
                    color: 'rgba(0,0,0,0.5)',
                    size: 10,
                    x: 5,
                    y: 5
                },
                shape: 'circle',
                shapeProperties: {
                    borderDashes: false, // only for borders
                    borderRadius: 6,     // only for box shape
                    interpolation: false,  // only for image and circularImage shapes
                    useImageSize: false,  // only for image and circularImage shapes
                    useBorderWithImage: false  // only for image shape
                },
                size: 25,
                title: undefined,
                value: undefined
            },
            edges: {
                color: '#000000',
                width: 0.5
            }
        };

        container.style.height = '600px';
        container.style.width = '800px';
        new vis.Network(container, this.state.network, options);
    }

    render() {
        const {identifier} = this.state;
        const style = {
            container: {
                position: 'relative',
            },
            refresh: {
                display: 'inline-block',
            }
        };
        return (
            <div id={identifier}  style={style.container}>
            </div>
        );
    }
}

DiscoveryGraph.defaultProps = {
    graph: {},
    style: {width: '640px', height: '480px'}
};

export default DiscoveryGraphBox;
