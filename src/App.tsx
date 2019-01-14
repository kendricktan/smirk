import React, { Component } from "react";
import { observer } from "mobx-react";

import { AppSettings } from "./models/AppSettings";
import { GrinBinaryState, AppState, GrinWalletState } from "./models/AppState";

import { Layout, Menu, Breadcrumb, Icon } from "antd";

import GrinBinaryDownloader from "./components/GrinBinaryDownloader";
import GrinWalletInit from "./components/GrinWalletInit";
import GrinWallet from "./components/GrinWallet";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

enum AppMenu {
  // Needs to be string
  // Otherwise sider auto converts it to a string
  // then the switch-case statement in 'getContent' won't work...
  Overview = "overview",
  Send = "send",
  Receive = "receive",
  NodeInformation = "node-information",
  Settings = "settings"
}

@observer
class App extends Component<
  { appSettings: AppSettings; appState: AppState },
  {}
> {
  state = {
    sliderCollapsed: false,
    selectedMenuKey: AppMenu.Overview
  };

  setSliderCollapsed = (c: boolean) => {
    this.setState({
      sliderCollapsed: c
    });
  };

  getContent() {
    const { selectedMenuKey } = this.state;

    switch (selectedMenuKey) {
      case AppMenu.Overview: {
        return <GrinWallet {...this.props} />;
      }

      default: {
        return <p>Under construction...</p>;
      }
    }
  }

  render() {
    const { appState } = this.props;

    switch (appState.grinBinaryState) {
      case GrinBinaryState.NotFound:
      case GrinBinaryState.Downloading: {
        return (
          <div style={{ paddingTop: "30px" }}>
            <GrinBinaryDownloader {...this.props} />
          </div>
        );
      }
      case GrinBinaryState.Found: {
        switch (appState.grinWalletState) {
          case GrinWalletState.ShowRecoveryKey:
          case GrinWalletState.Locked:
          case GrinWalletState.Uninitialized: {
            return (
              <div style={{ paddingTop: "30px" }}>
                <GrinWalletInit {...this.props} />
              </div>
            );
          }

          case GrinWalletState.Unlocked: {
            return (
              <Layout style={{ minHeight: "100vh" }}>
                <Sider
                  style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0
                  }}
                  collapsible
                  collapsed={this.state.sliderCollapsed}
                  onCollapse={this.setSliderCollapsed}
                >
                  <div className="logo" />
                  <Menu
                    onClick={({ item, key, keyPath }) => {
                      this.setState({ selectedMenuKey: key });
                    }}
                    theme="dark"
                    defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
                    mode="inline"
                  >
                    <Menu.Item key={AppMenu.Overview}>
                      <Icon type="project" />
                      <span>Overview</span>
                    </Menu.Item>
                    <Menu.Item key={AppMenu.Receive}>
                      <Icon type="download" />
                      <span>Receive</span>
                    </Menu.Item>
                    <Menu.Item key={AppMenu.Send}>
                      <Icon type="upload" />
                      <span>Send</span>
                    </Menu.Item>
                    <Menu.Item key={AppMenu.NodeInformation}>
                      <Icon type="bar-chart" />
                      <span>Node Information</span>
                    </Menu.Item>
                    <Menu.Item key={AppMenu.Settings}>
                      <Icon type="sliders" />
                      <span>Settings</span>
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Layout style={{ marginLeft: this.state.sliderCollapsed ? 75 : 200 }}>
                  <Content style={{ margin: "0 16px", paddingTop: "30px", overflow: 'initial' }}>
                    {this.getContent()}
                  </Content>
                  <Footer style={{ textAlign: "center" }}>
                    Smirk - GRIN Wallet &copy;
                  </Footer>
                </Layout>
              </Layout>
            );
          }
        }
        break;
      }
    }
  }
}

export default App;
