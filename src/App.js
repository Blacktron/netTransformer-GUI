import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import ConnectionDetailsBox from './ConnectionDetailsBox';
import ConnectionDetailsClient from './ConnectionDetailsClient';
import ResourceManagerBox from './ResourceManagerBox';
import ResourceManagerClient from './ResourceManagerClient';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const lightMuiTheme = getMuiTheme(lightBaseTheme);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 3,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      value: this.state.value,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
      value: this.state.value
    });
  };

  handleChange = (event, index, value) => this.setState({value});
  render() {
    return (
      <MuiThemeProvider muiTheme={lightMuiTheme}>
      <div className="App">
       <Toolbar>
        <ToolbarGroup firstChild={true}>
        <RaisedButton
          onTouchTap={this.handleTouchTap}
          label="Click me"
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
	<Menu>
            <MenuItem value={1} primaryText="Connections" />
            <MenuItem value={2} primaryText="Resources" />
            <MenuItem value={3} primaryText="Discovery" />
        </Menu>
        </Popover>
        </ToolbarGroup>
      </Toolbar>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NetTransformer</h2>
        </div>
       <ConnectionDetailsBox client={ConnectionDetailsClient} pollInterval={2000}  />
       <br/>
       <ResourceManagerBox client={ResourceManagerClient} pollInterval={2000}  />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
