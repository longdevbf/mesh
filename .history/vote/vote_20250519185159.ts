import {
  applyParamsToScript,
  Asset,
  deserializeAddress,
  mConStr0,
  MeshTxBuilder,
  MeshValue,
  serializePlutusScript,
  stringToHex,
  Transaction,
} from "@meshsdk/core";
import {
  blockchainProvider,
  getWalletInfoForTx,
  readValidator,
  wallet,
} from "../hackathon/adapter";

async function voting(): Promise<void>{
    try{
        const {utxos, walletAddress: addrCurrent, collateral} = await getWalletInfoForTx(wallet);
        console.log("utxos", utxos);




        
    }
    catch(e){
        console.log("Error", e);
    }


  
}
async function main(){
    await voting();
}
main();