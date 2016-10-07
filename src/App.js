import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ConnectionDetailsBox from './ConnectionDetailsBox';
import ConnectionDetailsClient from './ConnectionDetailsClient';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>NetTransformer</h2>
        </div>
        <ConnectionDetailsBox client={ConnectionDetailsClient} pollInterval={2000}  />
      </div>
    );
  }
}

export default App;
