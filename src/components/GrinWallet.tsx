import React, { Component } from "react";
import { observer } from "mobx-react";

import { AppSettings } from "../models/AppSettings";
import { AppState, appState } from "../models/AppState";

import { Button, Input, Card, Row, Col } from "antd";
import { GrinWalletRetrieveTx } from "../utils/Grin";

const satoshiToGrin = (x: number): string => {
  return (x / 1000000000).toFixed(4);
};

@observer
class GrinInitializer extends Component<
  { appSettings: AppSettings; appState: AppState },
  {}
> {
  componentDidMount() {
    // Update wallet summary info every 60 seconds
    appState.updateGrinWalletSummaryInfo();
    setInterval(() => appState.updateGrinWalletSummaryInfo(), 5000);

    // Update tx every 30 seconds
    appState.updateGrinWalletRetrievedTxs();
    setInterval(() => appState.updateGrinWalletRetrievedTxs(), 30000);
  }

  render() {
    const { appState } = this.props;

    const confirmedAmount: number =
      appState.grinWalletSummaryInfo.amount_currently_spendable;
    const unconfirmedAmount: number =
      appState.grinWalletSummaryInfo.amount_awaiting_confirmation;

    return (
      <Row type="flex" justify="space-around" align="middle">
        <Col span={20}>
          <Card bordered={false}>
            <p>
              <h2>
                <strong>{satoshiToGrin(confirmedAmount)}</strong> Spendable GRIN
              </h2>
            </p>

            <p>
              <h4>
                (<strong>{satoshiToGrin(unconfirmedAmount)}</strong> GRIN
                awaiting confirmation)
              </h4>
            </p>
          </Card>

          <br />

          {appState.grinWalletRetrievedTxs.map((x: GrinWalletRetrieveTx) => {
            return (
              <div>
                <Card bordered={false}>
                  <p>{`Created: ${x.creation_ts}, Confirmed: ${
                    x.confirmation_ts
                  }`}</p>

                  <p>{`Debit: ${x.amount_debited}, Credit: ${
                    x.amount_credited
                  }`}</p>
                </Card>
                <br />
              </div>
            );
          })}
        </Col>
      </Row>
    );
  }
}

export default GrinInitializer;
