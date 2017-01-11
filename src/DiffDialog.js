import {default as React} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const styles = {
    radioButton: {
        marginTop: 16,
    },
};

class DiffDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            versions: [],
        };
        // Functions must be bound manually with ES6 classes
        this.selectVersions = this.selectVersions.bind(this);
    }

    handleOpen = () => {
        this.selectVersions();
    };

    handleClose = () => {
        this.setState({open: false});
    };
    
    handleCreateDiff() {
        this.setState({open: false});
        this.props.client.doDiff(this.refs.radioButtonGroup1.state.selected, this.refs.radioButtonGroup2.state.selected,
            () => {
                console.log();
              this.props.handleDiffVersion("version1-version1");
            });
    }
    componentDidMount() {
        //this.handleOpen();
    }
    selectVersions() {
       console.log("GetVersion1");

        this.props.client.getVersion((versions) => {
            var arr1 = Object.keys(versions).map(function (k) {
                return {name: versions[k]}
            });
            this.setState({
                versions: arr1,
                open: false
            });
        });
        console.log("GetVersion2");
        this.props.client.getVersion((versions) => {
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
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Select"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCreateDiff.bind(this)}
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
                    title="Select versions"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >

                    <RadioButtonGroup name="ver1" defaultSelected="not_light" ref="radioButtonGroup1">
                        {radios}
                    </RadioButtonGroup>
                    <Divider />
                    <RadioButtonGroup name="ver2" defaultSelected="not_light" ref="radioButtonGroup2">
                        {radios}
                    </RadioButtonGroup>
                </Dialog>
            </div>

        );
    }
}


export default DiffDialog;
