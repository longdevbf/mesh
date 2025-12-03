import {
    deserializeAddress,
    mConStr0,
    stringToHex,
  } from "@meshsdk/core";
  import { getScript, getTxBuilder, getUtxoByTxHash, wallet } from "./common";
import { blockchainProvider } from "../vote/adapter";
   
  async function main() {
    // get utxo, collateral and address from wallet
    const utxos = await wallet.getUtxos();
    const walletAddress = (await wallet.getUsedAddresses())[0];
    const collateral = (await wallet.getCollateral())[0];
   const scriptUtxo = await blockchainProvider.fetchUTxOs('9c97a43a235a38efa2e7c558168d89bc9a91bbc0c84f799a570aee418e781c3c');
   
      console.log("Script Utxo: ", scriptUtxo);
    const { scriptCbor } = getScript();
    console.log("Script Cbor: ", scriptCbor);
    // hash of the public key of the wallet, to be used in the datum
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;
    // redeemer value to unlock the funds
    const message = "Hello, World!";
   
    // get the utxo from the script address of the locked funds
  //  const txHashFromDesposit = process.argv[2];
  //  const scriptUtxo = await getUtxoByTxHash('9c97a43a235a38efa2e7c558168d89bc9a91bbc0c84f799a570aee418e781c3c');
    console.log("Script Utxo: ", scriptUtxo);
      // build transaction with MeshTxBuilder
    const txBuilder = getTxBuilder();
    await txBuilder
      .spendingPlutusScript("V3") // we used plutus v3
      .txIn( // spend the utxo from the script address
        scriptUtxo.input.txHash,
        scriptUtxo.input.outputIndex,
        scriptUtxo.output.amount,
        scriptUtxo.output.address
      )
      .txInScript(scriptCbor)
      .txInRedeemerValue(mConStr0([stringToHex(message)])) // provide the required redeemer value `Hello, World!`
      .txInDatumValue(mConStr0([signerHash])) // only the owner of the wallet can unlock the funds
      .requiredSignerHash(signerHash)
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .selectUtxosFrom(utxos)
      .complete();
    const unsignedTx = txBuilder.txHex;
   
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log(`1 tADA unlocked from the contract at Tx ID: ${txHash}`);
  }
   
  main();