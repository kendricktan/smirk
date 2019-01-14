import React, { Component } from "react";
import { observer } from "mobx-react";

import { AppSettings } from "../models/AppSettings";
import { GrinWalletState, AppState, appState } from "../models/AppState";

import { grinLatestVersion, setupGrin } from "../utils/GrinSetup";

import { Button, Input, Card, Row, Col } from "antd";

@observer
class GrinInitializer extends Component<
  { appSettings: AppSettings; appState: AppState },
  {}
> {
  state = {
    password: "",
    retypePassword: "",
    invalidPassword: false,
    walletInitStdOut: ""
  };

  initializeWallet() {
    const { appState } = this.props;
    const { grin } = appState;

    // Initialize wallet
    const newGrin = grin.password(this.state.password);
    const stdout = newGrin.initializeWallet();

    // Update grin config
    appState.setGrin(newGrin);

    // Set Wallet to show recovery key
    appState.setGrinWalletState(GrinWalletState.ShowRecoveryKey);

    // See if server is initialized,
    // If not, initialize
    if (!newGrin.isServerInitialized()) {
      newGrin.initializeServer();
    }

    // SetState
    this.setState({
      walletInitStdOut: stdout
    });
  }

  proceedToUnlocked() {
    const { appState } = this.props;

    appState.setGrinWalletState(GrinWalletState.Unlocked)
  }

  unlockWallet() {
    const { appState } = this.props;
    const { grin } = appState;

    const newGrin = grin.password(this.state.password);

    if (newGrin.canUnlockWallet()) {
      appState.setGrin(newGrin);
      appState.setGrinWalletState(GrinWalletState.Unlocked);

      // See if server is initialized,
      // If not, initialize
      if (!newGrin.isServerInitialized()) {
        newGrin.initializeServer();
      }
    } else {
      this.setState({
        invalidPassword: true
      });
    }
  }

  getContent() {
    switch (appState.grinWalletState) {
      case GrinWalletState.Uninitialized: {
        const { password, retypePassword } = this.state;
        const passwordSame: boolean = password === retypePassword;

        return (
          <div>
            <h1>Grin Wallet Setup</h1>
            <h4>
              <strong>Wallet Config Location</strong>:{" "}
              {appState.grin._walletConfigDirectory}
            </h4>
            <br />
            <Input.Password
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
              value={password}
            />
            <br />
            <br />
            <Input.Password
              placeholder="Retype Password"
              onChange={e => this.setState({ retypePassword: e.target.value })}
              value={retypePassword}
            />
            <br />
            {!passwordSame && retypePassword.length > 0 && password.length > 0
              ? "Passwords must match one another"
              : ""}
            <br />
            <br />
            <Button
              disabled={
                !passwordSame ||
                password.length === 0 ||
                retypePassword.length === 0
              }
              onClick={() => this.initializeWallet()}
              block
              type="primary"
            >
              Setup
            </Button>
          </div>
        );
      }
      case GrinWalletState.Locked: {
        const { invalidPassword } = this.state;
        return (
          <div>
            <h1>Unlock Grin Wallet</h1>
            <h4>
              <strong>Wallet Config Location</strong>:{" "}
              {appState.grin._walletConfigDirectory}
            </h4>
            <br />
            <Input.Password
              onChange={e => this.setState({ password: e.target.value })}
              value={this.state.password}
              placeholder="Password"
            />
            <br />
            {invalidPassword ? "Invalid password" : ""}
            <br />
            <br />
            <Button
              disabled={this.state.password.length === 0}
              onClick={() => this.unlockWallet()}
              block
              type="primary"
            >
              Unlock Wallet
            </Button>
          </div>
        );
      }
      case GrinWalletState.ShowRecoveryKey: {
        return (
          <div>
            <h1>Recovery Keys</h1>
            <h3>
              <strong>
                Ensure you've copied down the recovery keys somewhere, once you
                leave this page its gone, forever.
              </strong>
            </h3>
            <br />
            {this.state.walletInitStdOut
              .split("\n")
              .filter(x => x.length > 0)
              .map(x => {
                return <p>{x}</p>;
              })}
            <br />
            <Button
              onClick={() => this.proceedToUnlocked()}
              block type="primary"
            >
              Ok, I've Copied Down My Recovery Keys
            </Button>
          </div>
        );
      }
      case GrinWalletState.Unlocked: {
        return <div>Wallet Unlocked</div>;
      }
    }
  }

  render() {
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col span={16}>
          <Card bordered={false}>{this.getContent()}</Card>
        </Col>
      </Row>
    );
  }
}

export default GrinInitializer;
