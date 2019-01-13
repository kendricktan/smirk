import React, { Component } from "react";
import logo from "../logo.svg";
import "../style/App.css";
import { observer } from "mobx-react";

import { AppSettings } from "../models/AppSettings";

import { setupGrin, hasGrinInPath } from '../utils/GrinSetup';
import { loadavg } from "os";


@observer
class App extends Component<{ appSettings: AppSettings }, {}> {
  state = {
    hasGrin: hasGrinInPath(),
    downloadingGrin: false,
    downloadingProgress: { loaded: 0, total: 0 } // In Bytes
  }

  componentDidMount() {
    // If we don't have 
    if (!this.state.hasGrin) {      
      this.setState({
        downloadingGrin: true
      }, () => {

        // Setups Grin Binary
        setupGrin(
          (pe) => {
            console.log(pe)
            this.setState({ downloadingProgress: pe })
          },
          () => {
            this.setState({
              downloadingGrin: false,
              hasGrin: hasGrinInPath()
            })
          }
        )
      })
    }
  }

  render() {
    const downloadingProgress: { loaded: number, total: number } = this.state.downloadingProgress
    const downloadedPercent = (downloadingProgress.loaded == 0 ? 0 : downloadingProgress.loaded / downloadingProgress.total) * 100

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {
              !this.state.hasGrin ?
              (
                this.state.downloadingGrin ?
                `Downloading Grin (${downloadedPercent.toFixed(2)} %)` :
                'Lol state not accounted for yet'
              )
              :
              'Grin Binary Found!'
            }
          </p>
        </header>
      </div>
    );
  }
}

export default App;
