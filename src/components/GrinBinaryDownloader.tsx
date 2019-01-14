import React, { Component } from "react";
import { observer } from "mobx-react";

import { AppSettings } from "../models/AppSettings";
import { GrinBinaryState, AppState } from "../models/AppState";

import { grinLatestVersion, setupGrin } from "../utils/GrinSetup";

import { Card, Row, Col } from "antd";

@observer
class GrinBinaryDownloader extends Component<
  { appSettings: AppSettings; appState: AppState },
  {}
> {
  componentDidMount() {
    const { appState } = this.props;
    // If we don't have grin
    if (appState.grinBinaryState === GrinBinaryState.NotFound) {
      // Start Downloading Grin
      appState.setGrinBinaryState(GrinBinaryState.Downloading);

      // Setup Grin and their respective callback(s)
      // Unsure if this is best way but ceebs
      setupGrin(
        pe => appState.setGrinBinaryDownloadProgress(pe),
        () => appState.setGrinBinaryState(GrinBinaryState.Found)
      );
    }
  }

  getContent() {
    const { appState } = this.props;

    switch (appState.grinBinaryState) {
      case GrinBinaryState.Downloading: {
        const grinDownloadProgress = appState.grinBinaryDownloadProgress;
        const grinDownloadPerecent =
          (isNaN(grinDownloadProgress.loaded)
            ? 0
            : grinDownloadProgress.loaded / grinDownloadProgress.total) * 100;

        return (
          <div>
            <h1>Grin Setup</h1>
            <h2>Downloading Grin {grinLatestVersion}... ({grinDownloadPerecent.toFixed(2)}%)</h2>
          </div>
        );
      }
      case GrinBinaryState.NotFound: {
        return <h2>Grin not found, preparing to download</h2>;
      }
    }
  }

  render() {
    const { appState } = this.props;
    const downloadingProgress: { loaded: number; total: number } =
      appState.grinBinaryDownloadProgress;
    const downloadedPercent =
      (downloadingProgress.loaded == 0
        ? 0
        : downloadingProgress.loaded / downloadingProgress.total) * 100;

    switch (appState.grinBinaryState) {
      case GrinBinaryState.Downloading: {
        break;
      }
    }

    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col span={16}>
          <Card bordered={false}>{this.getContent()}</Card>
        </Col>
      </Row>
    );
  }
}

export default GrinBinaryDownloader;
