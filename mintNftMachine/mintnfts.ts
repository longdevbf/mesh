import {
    ForgeScript,
    MeshTxBuilder,
    resolveScriptHash,
    stringToHex,
} from "@meshsdk/core";
import type { AssetMetadata } from '@meshsdk/core';
import { blockchainProvider, wallet } from "./common";
import { metadata } from "./metadata";
import { recipients } from "./recipients";

async function main() {
    
    const changeAddress = await wallet.getChangeAddress();
    const forgingScript = ForgeScript.withOneSignature(changeAddress); 
    const policyId = resolveScriptHash(forgingScript);
    
    console.log(await wallet.getBalance());
    
    const utxos = await wallet.getUtxos();
    console.log(utxos)
    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        verbose: true,
    });

    // Chuẩn bị metadata tổng hợp cho tất cả NFTs
    const combinedMetadata: { [assetName: string]: AssetMetadata } = {};

    // Xử lý mint cho từng recipient
    for (let recipient in recipients) {
        const recipientAddress = recipient;
        const assetNames = recipients[recipient];
        
        if (Array.isArray(assetNames)) {
            for (const assetName of assetNames) {
                const assetMetadata: AssetMetadata = metadata[assetName];
                if (!assetMetadata) {
                    console.warn(`No metadata found for asset: ${assetName}`);
                    continue;
                }
                
                // Thêm metadata vào object tổng hợp
                combinedMetadata[assetName] = assetMetadata;
                
                // Mint NFT và gửi đến recipient
                const assetNameHex = stringToHex(assetName);
                txBuilder
                    .mint("1", policyId, assetNameHex)
                    .mintingScript(forgingScript)
                    .txOut(recipientAddress, [
                        { unit: policyId + assetNameHex, quantity: "1" }
                    ]);
                
                console.log(`Minting ${assetName} for ${recipientAddress}`);
            }
        }
    }

    // Thêm metadata tổng hợp cho tất cả NFTs
    const fullMetadata = {
        [policyId]: combinedMetadata
    };

    console.log("Combined Metadata:", JSON.stringify(fullMetadata, null, 2));

    const unsignedTx = await txBuilder
        .metadataValue("721", fullMetadata)
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();
    
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    console.log("Mint Successful!");
    console.log("TxHash: " + txHash);
}

main();
//npx tsx mintnfts.ts