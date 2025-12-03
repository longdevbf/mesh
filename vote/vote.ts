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
} from "./adapter";

async function voting(): Promise<string | undefined>{
    try{
        const txHash = "40c2a42fe324759a640dcfddbc69ef2e3b7fe5a998af8d6660359772bf44c9dc";
        const {utxos, walletAddress: addrCurrent, collateral} = await getWalletInfoForTx(wallet);
        const pubkeyVoter = deserializeAddress(addrCurrent).pubKeyHash;
        const rewardAddress = await wallet.getRewardAddresses();
        console.log("Reward Address: ", rewardAddress);
        const compileCode = readValidator("voting.vote.vote");  
        const scriptCbor = applyParamsToScript(
            compileCode,
            []
        ) ;
        const drep = await wallet.getPubDRepKey();
        console.log("DRep: ", drep);
       // const dRep = await wallet.getDRep();
      //  const dRepId = dRep.dRepIDCip105;
        const scriptAddr = serializePlutusScript(
            {
                code: scriptCbor,
                version: "V3"
            },
            undefined,
            0,
        ).address;
        const text = await blockchainProvider.fetchAccountInfo(addrCurrent);
        console.log(text);
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
                txIndex: 0
            },
            {
            voteKind: "Yes",  
            anchor: {
                anchorUrl: "https://www.google.com",
                anchorDataHash: "40c2a42fe324759a640dcfddbc69ef2e3b7fe5a998af8d6660359772bf44c9dc00"
            }    
            }

        )
        .txOut(scriptAddr, [
            {
            unit: "lovelace",
            quantity: "1000000",
            }
        ])
        .voteRedeemerValue(mConStr0([]))
        .voteTxInReference(txHash, 0)
        .txIn(
            collateral.input.txHash!,
            collateral.input.outputIndex!,
        )
        .txInCollateral(collateral.input.txHash!,
            collateral.input.outputIndex!)
       .voteScript(scriptCbor)
        .selectUtxosFrom(utxos)
        .changeAddress(addrCurrent)
        .setNetwork("preprod")
        
        const compiledTx = await txBuilder.complete();
        const signedTx = await wallet.signTx(compiledTx, true);
        const txId = await wallet.submitTx(signedTx);
        return txId||" ";
    }
    catch(e){
        console.log("Error", e);
    }


  
}
async function main(){
  const tx =  await voting();
  console.log("Transaction ID: ", tx);
}
main();