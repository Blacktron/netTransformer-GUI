import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
// import ConnectionDetailsBox from './ConnectionDetailsBox';
// import ConnectionDetailsClient from './ConnectionDetailsClient';
import ResourceManagerBox from './ResourceManagerBox';
import ResourceManagerClient from './ResourceManagerClient';

class App extends Component {
  render() {
      // <ConnectionDetailsBox client={ConnectionDetailsClient} pollInterval={2000}  />
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NetTransformer</h2>
        </div>
          <ResourceManagerBox client={ResourceManagerClient} pollInterval={2000}  />

      </div>
    );
  }
}

export default App;
