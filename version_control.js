import {getUserVersion, setUserVersion,
    loadPlayerData, fetchScores, resetAllLocalData
} from "./data_manager.js";
import {apologizeForLostData} from "./ui_manager.js";

/**
 * X.Y.Z; 
 * X = Month; Y = Year; Z = # for multiple updates within the same month
 */
const VERSION = '2026.4.0';

/**
 * Maps version names to the functions required to bring data up to date with
 * that version
 */
const VERSION_HISTORY = {
    '2026.4.0': () => {
        /**
         * This is the first version, so no function is required. Either the current
         * version will be later, or (version == null) will trigger initialUpdate. I'm 
         * leaving the slot anyway to remind me of how the system is supposed to work.
         */
    }
};

export function checkVersionAndUpdate(){
  const userVersion = getUserVersion();
  const targetVersion = VERSION;

  if(!userVersion){
    runInitialUpdate();
    setUserVersion(targetVersion);
    /**
     * The rest of the function is unnecessary because runInitialUpdate
     * resets everything to dafaults for the latest version.
     */ 
    return;
  }

  if(userVersion === targetVersion){
    return;
  }

  runUpdates(userVersion, targetVersion);
  setUserVersion(targetVersion);
}

function runInitialUpdate(){
    const oldPlayerScores = fetchScores();
    const oldPlayerData = loadPlayerData();

    if(oldPlayerScores || oldPlayerData){
        apologizeForLostData();
    }

    resetAllLocalData();
}

function runUpdates(userVersion, targetVersion){
    console.log(`Updating from V${userVersion} to V${targetVersion}`);

    const sortedVersions = Object.keys(VERSION_HISTORY).sort((a,b) =>
         isNewerVersion(a,b) ? 1 : -1
    );

    for(const version of sortedVersions){
        if(
            isNewerVersion(version, userVersion) &&
            !isNewerVersion(version, targetVersion)
        ){
            VERSION_HISTORY[version]();
        }
    }
}

/**
 * 
 * @param {string} v1 
 * @param {string} v2 
 * 
 * Test whether v1 is newer than v2
 */
function isNewerVersion(v1, v2){
    // SA = String Array
    const v1SA = v1.split('.');
    const v2SA = v2.split('.');

    let v1NA = [];
    let v2NA = [];

    for(let i = 0; i < v1SA.length; ++i){
        v1NA[i] = Number(v1SA[i]);
        v2NA[i] = Number(v2SA[i]);
    }

    for(let i in v1NA){
        if(v1NA[i] === v2NA[i]){
            continue;
        }else{
            return v1NA[i] > v2NA[i]
        }
    }

    // If we make it to this point, the versions are the same. v1 is not newer.
    return false;
}