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
  render() {
    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col span={16}>
          <Card bordered={false}>
            Unlocked wallet content
          </Card>
        </Col>
      </Row>
    );
  }
}

export default GrinInitializer;
