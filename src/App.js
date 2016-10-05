import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ConnectionDetailsBox from './ConnectionDetailsBox';
import ConnectionDetailsClient from './ConnectionDetailsClient';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

//import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NetTransformer</h2>
        </div>

        <p className="App-intro">
            Connection Details
            <MuiThemeProvider>
                <ConnectionDetailsBox client={ConnectionDetailsClient} pollInterval={2000}  />
            </MuiThemeProvider>
        </p>
      </div>
    );
  }
}

export default App;
