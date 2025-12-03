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
  getTxBuilder
} from "../hackathon/adapter";

async function voting(): Promise<void>{
    try{
        const txHash = "fbb55886e13ab175e3f3155b208aa2f141bd63934ac642f03df159ab2b4cb012";
        const {utxos, walletAddress: addrCurrent, collateral} = await getWalletInfoForTx(wallet);
        const pubkeyVoter = deserializeAddress(addrCurrent).pubKeyHash;
        const compileCode = readValidator("voting.vote.vote");  
        const scriptCbor = applyParamsToScript(
            compileCode,
            []
        ) ;
        const scriptAddr = serializePlutusScript(
            {
                code: scriptCbor,
                version: "V3"
            },
            undefined,
            0,
        ).address;
        const txBuilder = getTxBuilder();
        await txBuilder
        .votePlutusScriptV3()
        .vote(
            {
                type: "DRep",
                drepId: pubkeyVoter,
            },
            {
                txHash: txHash,
                outputIndex: 0
            }
            0

        )
        .voteRedeemerValue(mConStr0([]))
        .voteScript(scriptCbor)
        .selectUtxosFrom(utxos)
        .changeAddress(addrCurrent)
        .setNetwork("preprod")
        





    }
    catch(e){
        console.log("Error", e);
    }


  
}
async function main(){
    await voting();
}
main();