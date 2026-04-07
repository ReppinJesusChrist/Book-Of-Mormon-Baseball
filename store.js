import {getPurchases, setPurchases} from "./data_manager.js";

export const STORE_DEFS = {
    runnerColors: {
        headerText: "Runner Color Options",
        colorOptions: [
            {
                value: "red",
                price: 10,
            },
            {
                value: "blue",
                price: 50,
            },
            {
                value: "yellow",
                price: 150,
            },
            {
                value: "green",
                price: 600,
            },
            {
                value: "orange",
                price: 3000,
            },
            {
                value: "purple",
                price: 15000,
            },
        ]
    }
}

export function unlockStoreItem(targetValue){
    let currUnlocks = getPurchases();
    const colorDefs = STORE_DEFS.runnerColors.colorOptions;
    for(const [index, {value, price}] of Object.entries(colorDefs)){
        if(value == targetValue){
            currUnlocks.colorOptions[index] = true;
            console.log(value, " unlocked");
        }
    }
    setPurchases(currUnlocks);
}

export function isStoreItemUnlocked(targetValue){
    let currUnlocks = getPurchases;
    const colorDefs = STORE_DEFS.runnerColors.colorOptions;
    for(const [index, {value, price}] of Object.entries(colorDefs)){
        if(value == targetValue){
            return currUnlocks[index];
        }
    }
    return true;
}