import axios from "axios";


import { electronOs, electronFs, electronChildProcess } from "./windowTools";
import { fstat } from "fs";

const { execSync } = electronChildProcess

const isWin: boolean = electronOs.platform().indexOf("win") > -1;
const whereCmd = isWin ? "where" : "whereis";
const latestVersion: string = "v0.5.2";

const grinDirectory: string = `${electronOs.homedir()}/.grin`;
const grinBinDirectory: string = `${grinDirectory}/bin`;
const grinBinPath: string = `${grinBinDirectory}/grin`;
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

  // Checks if we've downloaded
  // Grin previously
  if (electronFs.existsSync(grinBinPath)) {
    return true;
  }

  try {
    const stdout =  execSync('command -v grin 2>/dev/null && { echo >&1 grin; exit 0; }')
    return !!stdout;
  } catch (err) { }

  return false;
};

export const setupFolderStructure = () => {
  if (!electronFs.existsSync(grinDirectory)) {
    electronFs.mkdirSync(grinDirectory);
  }

  if (!electronFs.existsSync(grinBinDirectory)) {
    electronFs.mkdirSync(grinBinDirectory);
  }
};

export const setupGrin = (
  downloadProgressCb: (progressEvent: ProgressEvent) => void,
  finalCallback: () => void
) => {
  // Only supports linux for now
  axios
    .get(grinDownloadUrls.linux[latestVersion].url, {
      headers: { Accept: "*/*" },
      responseType: "arraybuffer",
      onDownloadProgress: downloadProgressCb
    })
    .then(response => {
      try {
        const grinTgzLocation = `${grinBinDirectory}/grin.tgz`

        // Save as grin.tar.gz
        // Need to write as stream
        // Otherwise will only save first 20 bytes
        const wstream = electronFs.createWriteStream(grinTgzLocation);
        wstream.write(Buffer.from(response.data))
        wstream.end();

        wstream.on('close', () => {
          // Unpack .tgz file and remove it
          execSync(`tar -zxvf grin.tgz`, { cwd: grinBinDirectory });
          execSync(`rm grin.tgz`, { cwd: grinBinDirectory });

          // Final callback
          finalCallback()
        })

      } catch (e) {
        alert(`Error saving grin, reason: ${e}`);
      }
    })
};
