import React, { Component } from "react";
import { observer } from "mobx-react";

import { AppSettings } from "./models/AppSettings";
import { GrinBinaryState, AppState, GrinWalletState } from "./models/AppState";

import { setupGrin } from "./utils/GrinSetup";

import { Card, Row, Col } from "antd";

import GrinBinaryDownloader from "./components/GrinBinaryDownloader";
import GrinWalletInit from "./components/GrinWalletInit";
import GrinWallet from "./components/GrinWallet";

@observer
class App extends Component<
  { appSettings: AppSettings; appState: AppState },
  {}
> {

  render() {
    const { appState } = this.props;

    switch (appState.grinBinaryState) {
      case GrinBinaryState.NotFound:
      case GrinBinaryState.Downloading: {
        return <GrinBinaryDownloader {...this.props} />;
      }
      case GrinBinaryState.Found: {
        switch (appState.grinWalletState) {
          case GrinWalletState.ShowRecoveryKey:
          case GrinWalletState.Locked:
          case GrinWalletState.Uninitialized: {
            return <GrinWalletInit {...this.props} />;
          }

          case GrinWalletState.Unlocked: {
            return <GrinWallet {...this.props} />;
          }
        }
        break;
      }
    }
  }
}

export default App;
