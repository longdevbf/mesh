import {
    BlockfrostProvider,
    MeshTxBuilder,
    MeshWallet
} from "@meshsdk/core";
import  {wallet, blockchainProvider, }  from "./common";
async function main(){
    const rewardAddress = await wallet.getRewardAddresses()[0];
    const address = await wallet.getChangeAddress();
    const utxos = await wallet.getUtxos();
    const pool = await block
}
main();