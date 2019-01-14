import axios from "axios";

import { electronOs, electronFs, electronChildProcess } from "./windowTools";

import { GrinNetwork } from '../models/AppState'

const { execSync } = electronChildProcess;

export const grinLatestVersion: string = "v0.5.2";
export const grinDirectory: string = `${electronOs.homedir()}/.grin`;
export const grinBinPath: string = `${grinDirectory}/grin`;

const grinDownloadUrls: {
  [platform: string]: { [version: string]: { url: string; checksum: string } };
} = {
  linux: {
    "v0.5.2": {
      url:
        "https://github.com/mimblewimble/grin/releases/download/v0.5.2/grin-v0.5.2-478131988-linux-amd64.tgz",
      checksum: "21ee7df5e811cdac045f1a96c79e76a0"
    }
  }
};

export const hasGrinInPath = (): boolean => {
  setupFolderStructure();

  // Checks if we do have grin
  return electronFs.existsSync(grinBinPath);
};

export const setupFolderStructure = () => {
  if (!electronFs.existsSync(grinDirectory)) {
    electronFs.mkdirSync(grinDirectory);
  }
};

export const setupGrinConfig = (
  grinNetwork: GrinNetwork = GrinNetwork.Floonet
): void => {
  let grinWalletConfigDirectory: string = ''
  let grinNetworkParam: string = ''

  switch(grinNetwork) {
    case GrinNetwork.Floonet: {
      grinNetworkParam = '--floonet'
      grinWalletConfigDirectory = `${grinDirectory}/floo`
      break;
    }
    case GrinNetwork.Mainnet: {
      grinWalletConfigDirectory = grinDirectory
      break;
    }
  }

  // Setups grin-wallet.toml
  if (!electronFs.existsSync(`${grinWalletConfigDirectory}/grin-wallet.toml`)) {
    execSync(`./grin ${grinNetworkParam} wallet init`, { cwd: grinDirectory });
  }

  // Setups grin-server.toml
  if (!electronFs.existsSync(`${grinDirectory}/grin-server.toml`)) {
    execSync(`./grin ${grinNetworkParam} server config`, { cwd: grinDirectory });
  }
}

export const setupGrin = (
  downloadProgressCb: (progressEvent: ProgressEvent) => void,
  finalCallback: () => void
) => {
  // Only supports linux for now
  // Downloads latest Grin Version
  axios
    .get(grinDownloadUrls.linux[grinLatestVersion].url, {
      headers: { Accept: "*/*" },
      responseType: "arraybuffer",
      onDownloadProgress: downloadProgressCb
    })
    .then(response => {
      try {
        const grinTgzLocation = `${grinDirectory}/grin.tgz`;

        // Save as grin.tar.gz
        // Need to write as stream
        // Otherwise will only save first 20 bytes
        const wstream = electronFs.createWriteStream(grinTgzLocation);
        wstream.write(Buffer.from(response.data));
        wstream.end();

        wstream.on("close", () => {
          // Unpack .tgz file and remove compressed file
          execSync(`tar -zxvf grin.tgz`, { cwd: grinDirectory });
          execSync(`rm grin.tgz`, { cwd: grinDirectory });
          execSync(`chmod +x grin`, { cwd: grinDirectory });

          // Initialize grin-

          // Final callback
          finalCallback();
        });
      } catch (e) {
        alert(`Error saving grin, reason: ${e}`);
      }
    });
};
