import { observable } from "mobx";
import { hasGrinInPath } from "../utils/GrinSetup";
import { Grin, grin } from "../utils/Grin";

export enum GrinBinaryState {
  NotFound,
  Found,
  Downloading
}

export enum GrinNetwork {
  Floonet,
  Mainnet
}

export enum GrinWalletState {
  Uninitialized,
  ShowRecoveryKey,
  Locked, // has grin-wallet.toml but haven't entered password
  Unlocked
}

export class AppState {
  @observable grinNetwork: GrinNetwork = GrinNetwork.Floonet;

  @observable grin: Grin = grin.network(this.grinNetwork);

  // If grin-wallet.toml is there,
  // then wallet is locked, prompt to enter password :-)
  @observable grinWalletState: GrinWalletState = this.grin.isWalletInitialized()
    ? GrinWalletState.Locked
    : GrinWalletState.Uninitialized;

  @observable grinBinaryDownloadProgress: ProgressEvent = {} as ProgressEvent;
  @observable grinBinaryState: GrinBinaryState = hasGrinInPath()
    ? GrinBinaryState.Found
    : GrinBinaryState.NotFound;

  setGrin(g: Grin): void {
    this.grin = g;
  }

  setGrinWalletState(gw: GrinWalletState): void {
    this.grinWalletState = gw;
  }

  setGrinBinaryDownloadProgress(gp: ProgressEvent): void {
    this.grinBinaryDownloadProgress = gp;
  }

  setGrinBinaryState(gs: GrinBinaryState): void {
    this.grinBinaryState = gs;
  }

  setGrinNetwork(gn: GrinNetwork): void {
    this.grinNetwork = gn;
  }
}

export const appState = new AppState();
