import {
    CIP68_222,
    stringToHex,
    mConStr0,
    CIP68_100,
    metadataToCip68,
    deserializeAddress,
    MeshTxBuilder,
    BlockfrostProvider,
    MeshWallet,
    applyParamsToScript,
    resolveScriptHash,
    serializeAddressObj,
    serializePlutusScript,
    scriptAddress,
    deserializeDatum,
    DeserializedAddress,
    PlutusScript,
    
  } from "@meshsdk/core";
  import plutus from './plutus.json';
  import { Plutus } from "./interface";
  import { getScript, getWalletInfoForTx, wallet } from './common';
  
  // Configuration constants
  const BLOCKFROST_API_KEY = 'preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL';
  const NETWORK_ID = 0; // 0 = Testnet (Preview, Preprod), 1 = Mainnet
  const PLATFORM_FEE = '1000000'; // 1 ADA in lovelace
  const TOKEN_NAME = 'Test function';
  const MIN_ADA_WITH_TOKEN = '1500000'; // 1.5 ADA
  const IMAGE_IPFS_HASH = 'ipfs://bafkreibktdoly7abv5gqg6xn7gskjliyxw3sqflqldznehbh4r3p522p6a';

  const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
  function readValidator(title: string): string {
    const validator = plutus.validators.find(v => v.title === title);
    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }
    return validator.compiledCode;
  }

  async function main() {
    try {
      const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet); //wallet farmer
      const { scriptCbor , scriptAddr } = getScript();
      console.log("scriptAddr : " + scriptAddr);
      const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
      const exChange = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
      const pubkeyExchange = deserializeAddress(exChange).pubKeyHash;
      
      const tokenMetadata = {
        name: TOKEN_NAME ,
        image: IMAGE_IPFS_HASH,
        mediaType: "image/jpg", 
        description: "My second  CIP68 token DID",
        _pk: userPubKeyHash, // Required by validator
        hex: "kasjdiuopwipodpeoiwopioeewppoife",
      };
      
        
      // Get validator scripts
      console.log("Reading validators from blueprint...");
      const mintCompilecode = readValidator( "mint.mint.mint");
      const storeCompilecode = readValidator( "store.store.spend");
      console.log("read oke");
      const storeScriptCbor = applyParamsToScript(storeCompilecode, [userPubKeyHash, pubkeyExchange]);
      const storeScript = {
        code: storeScriptCbor,
        version: "V3" as "V3",
      };
      console.log("storeScript : ", storeScript);
      const scriptAddr = serializePlutusScript(
            { code: scriptCbor, version: "V3" },
            undefined,
            0,
          ).address;
      const storeAddress = serializeAddressObj(
        scriptAddress(
          deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
          deserializeAddress(exChange).stakeCredentialHash,
          false,
        ),
        0,
      );
      console.log("storeAddress : ", storeAddress);
      const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        verbose: true,
      });
      
    const storeScriptHash = deserializeAddress(storeAddress).scriptHash;
      const mintScriptCbor = applyParamsToScript(mintCompilecode, [
        pubkeyExchange,
        BigInt(1),
        storeScriptHash,
        deserializeAddress(exChange).stakeCredentialHash,
        userPubKeyHash,
      ]);
      const mintScript = {
        code: mintScriptCbor,
        version: "V3",
      };
      const policyId = resolveScriptHash(mintScriptCbor, "V3");
      const hexAssetName = stringToHex(TOKEN_NAME);
      console.log("policyid : ", policyId);
      // Start building transaction
      console.log("Building mint transaction...");
      const unsignedTx = txBuilder.mintPlutusScriptV3();
      
      // Mint reference and user tokens
      unsignedTx
        // Mint user token (CIP68_222)
        //.mintPlutusScriptV3()
        .mint("1", policyId, CIP68_222(hexAssetName))
        .mintingScript(mintScriptCbor)
        .mintRedeemerValue(mConStr0([]))
        
        // Mint reference token (CIP68_100)
        .mintPlutusScriptV3()
        .mint("1", policyId, CIP68_100(hexAssetName))
        .mintingScript(mintScriptCbor)
        .mintRedeemerValue(mConStr0([]))
        
        // Store reference token with metadata at store address
        .txOut(storeAddress, [
          {
            unit: policyId + CIP68_100(hexAssetName),
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
      
        .txOut(exChange, [  // In this example, platform is the same as user
          {
            unit: "lovelace",
            quantity: PLATFORM_FEE
          }
        ])
        .changeAddress(walletAddress)
        .requiredSignerHash(userPubKeyHash)
        .selectUtxosFrom(utxos)
        .txInCollateral(
          collateral.input.txHash, 
          collateral.input.outputIndex, 
          collateral.output.amount, 
          collateral.output.address
        )
        .setNetwork("preprod")
        .addUtxosFromSelection();
      // Complete, sign, and submit the transaction
      //console.log("Completing transaction...");
      const completedTx = await unsignedTx.complete();
      
      //console.log("Signing transaction...");
      const signedTx =  wallet.signTx(completedTx, true);
      
      console.log("Submitting transaction...");
     const txHash = await wallet.submitTx(signedTx);
      
      console.log("Transaction submitted successfully!");
      console.log("Transaction hash:", txHash);
      console.log(`Check explorer: https://preprod.cexplorer.io/tx/${txHash}`);
      
      return txHash;
    } catch (error) {
      console.error("Error in mint process:", error);
      throw error;
    }
  }
  
  // Execute the mint function
  main()
    .then(txHash => console.log("Mint completed with hash:", txHash))
    .catch(err => console.error("Mint failed:", err));
  
  // Run with: npx tsx mint.ts