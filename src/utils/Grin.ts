import { grinDirectory, grinBinPath } from "./GrinSetup";
import { GrinNetwork } from "../models/AppState";

import { electronOs, electronFs, electronChildProcess } from "./windowTools";

const { execSync } = electronChildProcess;

const cloneInstance = (instance: object) => {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instance)),
    instance
  );
};

export class Grin {
  _network: GrinNetwork;
  _networkParam: String;
  _password: String;
  _walletConfigDirectory: String;
  _serverConfigDirectory: String;

  constructor() {
    this._password = {} as String;
    this._networkParam = {} as String;
    this._network = {} as GrinNetwork;
    this._walletConfigDirectory = "";
    this._serverConfigDirectory = grinDirectory;
  }

  network(n: GrinNetwork): Grin {
    const clone: Grin = cloneInstance(this);
    clone._network = n;

    switch (clone._network) {
      case GrinNetwork.Floonet: {
        clone._walletConfigDirectory = `${grinDirectory}/floo`;
        clone._networkParam = `--floonet `
        break;
      }

      default: {
        clone._walletConfigDirectory = `${grinDirectory}`;
        clone._networkParam = ``
        break;
      }
    }

    return clone;
  }

  password(p: String): Grin {
    const clone: Grin = cloneInstance(this);
    clone._password = p;

    return clone;
  }

  // If wallet is not initialized, we need to prompt
  // for password on the frontend
  isWalletInitialized(): boolean {
    return electronFs.existsSync(
      `${this._walletConfigDirectory}/grin-wallet.toml`
    );
  }

  // Creates grin-wallet.toml if doesn't exist
  initializeWallet() {
    execSync(`./grin ${this._networkParam} wallet -p ${this._password} init`, { cwd: grinDirectory })
  }

  // Unlocked wallet
  canUnlockWallet(): boolean {
    try {
      execSync(`./grin ${this._networkParam} wallet -p ${this._password} info`, { cwd: grinDirectory })
      return true;
    } catch(err) {}

    return false;
  }

  // Creates grin-server.toml if doesn't exist
  initializeServer() {}
}

export const grin = new Grin();

export const execGrinWalletInit = () => {};

export const execGrinWalletOwnerApi = () => {};

export const execGrinWalletListener = () => {};

export const execGrin = () => {};
