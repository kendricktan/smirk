
import React, { Component } from 'react';
import logo from '../logo.svg';
import '../style/App.css';
import {observer} from 'mobx-react';

import { AppSettings } from '../models/AppSettings'

@observer
class App extends Component<{appSettings: AppSettings}, {}> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React Right Now in {this.props.appSettings.language}
          </a>
        </header>
      </div>
    );
  }
}

export default App;
