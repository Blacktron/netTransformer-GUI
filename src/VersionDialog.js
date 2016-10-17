import {default as React, Component} from 'react';
import VersionClient from './VersionClient';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Grid, Row, Col } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const styles = {
    radioButton: {
        marginTop: 16,
    },
};

class VersionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            versions: [],
        };
        // Functions must be bound manually with ES6 classes
        this.loadVersionsFromServer = this.loadVersionsFromServer.bind(this);
    }

    handleOpen = () => {
        this.loadVersionsFromServer();
    };

    handleClose = () => {
        this.setState({open: false});
    };
    
    handleOpenVersion() {
        this.handleClose();
        this.props.handleOpenVersion(this.refs.radioButtonGroup.state.selected);
    }
    componentDidMount() {
        //this.handleOpen();
    }
    loadVersionsFromServer() {
        VersionClient.getVersions((versions) => {
            var arr = Object.keys(versions).map(function (k) {
                return {name: versions[k]}
            });
            this.setState({
                versions: arr,
                open: true
            });
        });
    }
    render() {
        self = this;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Open"
                primary={true}
                keyboardFocused={true}
                onTouchTap={self.handleOpenVersion.bind(self)}
            />,
        ];

        const radios = [];
        for (let i = 0; i < this.state.versions.length; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={`${this.state.versions[i].name}`}
                    label={`${this.state.versions[i].name}`}
                    style={styles.radioButton}
                />
            );
        }

        return (
            <div>
                <Dialog
                    title="Select graph version"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <RadioButtonGroup name="shipSpeed" defaultSelected="not_light" ref="radioButtonGroup">
                        {radios}
                    </RadioButtonGroup>
                </Dialog>
            </div>
        );
    }
}


export default VersionDialog;
