import { grinDirectory, grinBinPath } from "./GrinSetup";
import { GrinNetwork } from "../models/AppState";

import { electronOs, electronFs, electronChildProcess } from "./windowTools";
import { ChildProcess } from "child_process";

const { spawn } = electronChildProcess;
const { execSync } = electronChildProcess;

export class Grin {
  // Basic Configuration
  _network: GrinNetwork;
  _networkParam: String;
  _password: String;
  _walletConfigDirectory: String;
  _serverConfigDirectory: String;

  // Keep track of Grin Wallet Foreign API process
  // And Grin Wallet Owner API process
  _walletForeignProcess: ChildProcess;
  _walletOwnerProcess: ChildProcess;

  constructor() {
    this._password = {} as String;
    this._networkParam = {} as String;
    this._network = {} as GrinNetwork;
    this._walletConfigDirectory = "";
    this._serverConfigDirectory = grinDirectory;

    this._walletForeignProcess = {} as ChildProcess;
    this._walletOwnerProcess = {} as ChildProcess;
  }

  network(n: GrinNetwork): Grin {
    this._network = n;

    switch (this._network) {
      case GrinNetwork.Floonet: {
        this._walletConfigDirectory = `${grinDirectory}/floo`;
        this._networkParam = `--floonet `;
        break;
      }

      default: {
        this._walletConfigDirectory = `${grinDirectory}`;
        this._networkParam = ``;
        break;
      }
    }

    return this;
  }

  password(p: String): Grin {
    this._password = p;

    return this;
  }

  // If wallet is not initialized, we need to prompt
  // for password on the frontend
  isWalletInitialized(): boolean {
    return electronFs.existsSync(
      `${this._walletConfigDirectory}/grin-wallet.toml`
    );
  }

  // Creates grin-wallet.toml if doesn't exist
  initializeWallet(): String {
    const output: Buffer = execSync(`./grin ${this._networkParam} wallet -p ${this._password} init`, {
      cwd: grinDirectory
    });

    console.log(output.toString())

    return output.toString()
  }

  // Unlocked wallet
  canUnlockWallet(): boolean {
    try {
      execSync(
        `./grin ${this._networkParam} wallet -p ${this._password} info`,
        { cwd: grinDirectory }
      );
      return true;
    } catch (err) {}

    return false;
  }

  // Checks to see if server is initialized
  isServerInitialized(): boolean {
    return electronFs.existsSync(
      `${this._serverConfigDirectory}/grin-server.toml`
    );
  }

  // Creates grin-server.toml if doesn't exist
  initializeServer() {
    execSync(`./grin ${this._networkParam} server config`, {
      cwd: grinDirectory
    });
  }

  // Checks to see if wallet owner api is up


  // Spawns wallet foreign api listener
  spawnWalletForeignProcess() {

  }
}

export const grin = new Grin();

export const execGrinWalletInit = () => {};

export const execGrinWalletOwnerApi = () => {};

export const execGrinWalletListener = () => {};

export const execGrin = () => {};
