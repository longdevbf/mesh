import {
    CIP68_222,
    stringToHex,
    mConStr0,
    CIP68_100,
    metadataToCip68,
    deserializeAddress,
    MeshTxBuilder,
    BlockfrostProvider,
    applyParamsToScript,
    resolveScriptHash,
    serializeAddressObj,
    serializePlutusScript,
    scriptAddress,
  } from "@meshsdk/core";
  import plutus from './plutus.json';
  import { getScript, getWalletInfoForTx, wallet, blockchainProvider, txBuilder, readValidator } from './common';
  
  // Configuration constants
  const PLATFORM_FEE = '1000000';
  const TOKEN_NAME = 'Blockchain';
  const IMAGE_IPFS_HASH = 'bafkreibktdoly7abv5gqg6xn7gskjliyxw3sqflqldznehbh4r3p522p6a';
  
  async function main() {
    try {
      const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet); 

      const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
      const exChange = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";

      const pubkeyExchange = deserializeAddress(exChange).pubKeyHash;

      const tokenMetadata = {
        name: TOKEN_NAME ,
        image: IMAGE_IPFS_HASH,
        mediaType: "image/jpg", 
        description: "My second token",
        _pk: userPubKeyHash,//bat buoc 
      };
      const mintCompilecode = readValidator( "mint.mint.mint");
      const storeCompilecode = readValidator( "store.store.spend");
      const storeScriptCbor = applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1), userPubKeyHash]);

      const storeScript = {
        code: storeScriptCbor,
        version: "V3" as "V3",
      };

      const storeAddress = serializeAddressObj( //-> address store
        scriptAddress(
          deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
          deserializeAddress(exChange).stakeCredentialHash,
          false,
        ),
        0,
      );

      const storeScriptHash = deserializeAddress(storeAddress).scriptHash;

      const mintScriptCbor = applyParamsToScript(mintCompilecode, [
        pubkeyExchange,
        BigInt(1),
        storeScriptHash,
        deserializeAddress(exChange).stakeCredentialHash,
        userPubKeyHash,
      ]);
    
      const policyId = resolveScriptHash(mintScriptCbor, "V3");
      const hexAssetName = stringToHex(TOKEN_NAME);
      const unsignedTx = txBuilder.mintPlutusScriptV3();
    
      unsignedTx
      //mint prefix 222
        .mint("1", policyId, CIP68_222(hexAssetName))
        .mintingScript(mintScriptCbor)
        .mintRedeemerValue(mConStr0([]))

      //mint prefix 100
        .mintPlutusScriptV3()
        .mint("1", policyId, CIP68_100(hexAssetName))
        .mintingScript(mintScriptCbor)
        .mintRedeemerValue(mConStr0([]))
        
        // Store reference token with metadata at store address
        .txOut(storeAddress, [
          {
            unit: policyId + CIP68_100(hexAssetName), //_> string
            quantity: "1"
          }
          
        ])
        .txOutInlineDatumValue(metadataToCip68( tokenMetadata))
        
      // Send user token to wallet
      .txOut(walletAddress, [
        {
          unit: policyId + CIP68_222(hexAssetName),
          quantity: "1"
        },   
      ])
      
      
      // Add platform fee payment
      
        .txOut(exChange, [  
          {
            unit: "lovelace",
            quantity: PLATFORM_FEE
          }
        ])

        .changeAddress(walletAddress)
        .requiredSignerHash(userPubKeyHash)//-> minh phai la nguoi ki giao dich
        .selectUtxosFrom(utxos)
        .txInCollateral(
          collateral.input.txHash, 
          collateral.input.outputIndex, 
          collateral.output.amount, 
          collateral.output.address
        )
        .setNetwork("preprod")
        .addUtxosFromSelection();

      const completedTx = await unsignedTx.complete();
      const signedTx = await wallet.signTx(completedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      
      console.log("Transaction submitted successfully!");
      console.log("Transaction hash:", txHash);
    
      return txHash;
    } catch (error) {
      console.error("Error in mint process:", error);
      throw error;
    }
  }

  main()
    .then(txHash => console.log("Mint completed with hash:", txHash))
    .catch(err => console.error("Mint failed:", err));
  //npx tsx mint.ts