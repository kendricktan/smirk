import axios from "axios";
import { grinDirectory, grinBinPath } from "./GrinSetup";
import { GrinNetwork } from "../models/AppState";

import { electronOs, electronFs, electronChildProcess } from "./windowTools";
import { ChildProcess } from "child_process";

const { execSync, spawn } = electronChildProcess;

export class Grin {
  // Basic Configuration
  _network: GrinNetwork;
  _networkParam: String;
  _password: String;
  _apiSecret: String;
  _walletConfigDirectory: String;
  _serverConfigDirectory: String;

  // Keep track of Grin Wallet Foreign API process
  // And Grin Wallet Owner API process
  _nodeProcess: ChildProcess;
  _walletForeignProcess: ChildProcess;
  _walletOwnerProcess: ChildProcess;

  constructor() {
    this._password = {} as String;
    this._apiSecret = {} as String;
    this._networkParam = {} as String;
    this._network = {} as GrinNetwork;
    this._walletConfigDirectory = "";
    this._serverConfigDirectory = grinDirectory;

    this._nodeProcess = {} as ChildProcess;
    this._walletForeignProcess = {} as ChildProcess;
    this._walletOwnerProcess = {} as ChildProcess;
  }

  network(n: GrinNetwork): Grin {
    this._network = n;

    switch (this._network) {
      case GrinNetwork.Floonet: {
        this._walletConfigDirectory = `${grinDirectory}/floo`;
        this._networkParam = `--floonet`;
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

  // Reads the .api_secret file
  getApiSecrets(): Grin {
    const as: Buffer = electronFs.readFileSync(
      `${this._walletConfigDirectory}/.api_secret`
    );
    const s = as.toString();

    this._apiSecret = s;

    return this;
  }

  // Creates grin-wallet.toml if doesn't exist
  initializeWallet(): String {
    const output: Buffer = execSync(
      `./grin ${this._networkParam} wallet -p ${this._password} init`,
      {
        cwd: grinDirectory
      }
    );

    return output.toString();
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

  // Is Node API running
  isNodeProcessRunning(): Promise<boolean> {
    return axios
      .get("http://localhost:13413")
      .then(() => {
        return true;
      })
      .catch(err => {
        if (err.response) {
          return true;
        }
        return false;
      });
  }

  spawnNodeProcess(): void {
    const p: ChildProcess = spawn(
      `./grin`,
      [`${this._networkParam}`, "server", "run"],
      { cwd: grinDirectory, detached: true, stdio: "ignore" }
    );

    this._nodeProcess = p;
  }

  // Checks to see if wallet owner api is up
  isWalletForeignProcessRunning() {
    return axios
      .get("http://localhost:13415")
      .then(() => {
        return true;
      })
      .catch(err => {
        if (err.response) {
          return true;
        }
        return false;
      });
  }

  // Spawns wallet foreign api listener
  spawnWalletForeignProcess() {
    const p: ChildProcess = spawn(
      `./grin`,
      [`${this._networkParam}`, "wallet", "-p", `${this._password}`, "listen"],
      { cwd: grinDirectory, detached: true, stdio: "ignore" }
    );

    this._walletForeignProcess = p;
  }

  // Checks to see if wallet owner api is up
  isWalletOwnerProcessRunning() {
    return axios
      .get("http://localhost:13420")
      .then(() => {
        return true;
      })
      .catch(err => {
        if (err.response) {
          return true;
        }
        return false;
      });
  }

  // Spawns wallet foreign api listener
  spawnWalletOwnerProcess() {
    const p: ChildProcess = spawn(
      `./grin`,
      [
        `${this._networkParam}`,
        "wallet",
        "-p",
        `${this._password}`,
        "owner_api"
      ],
      { cwd: grinDirectory, detached: true, stdio: "ignore" }
    );

    this._walletOwnerProcess = p;
  }

  // Kills all process
  killAllProcess() {
    try {
      this._nodeProcess.kill();
    } catch (e) {}
    try {
      this._walletForeignProcess.kill();
    } catch (e) {}
    try {
      this._walletOwnerProcess.kill();
    } catch (e) {}
  }
}

export const grin = new Grin();
