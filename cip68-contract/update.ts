import {
  CIP68_100,
  stringToHex,
  mConStr0,
  metadataToCip68,
  deserializeAddress,
  MeshTxBuilder,
  BlockfrostProvider,
  applyParamsToScript,
  resolveScriptHash,
  serializeAddressObj,
  serializePlutusScript,
  scriptAddress,
  PlutusScript,
  UTxO
} from "@meshsdk/core";
import { isEmpty, isNil } from "lodash";
import { getWalletInfoForTx, wallet, readValidator, getAddressUTXOAsset, txBuilder, getUtxoForTx } from './common';

const PLATFORM = {
  address: "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6",
  fee: "1000000", 
  network: "preprod"
};

const platformPubKeyHash = deserializeAddress(PLATFORM.address).pubKeyHash;
const platformStakeCredential = deserializeAddress(PLATFORM.address).stakeCredentialHash;

async function updateTokens(
  tokenInfo: Array<{ 
    assetName: string; 
    metadata: Record<string, string>; 
    txHash?: string;
  }>,
  ownerInfo: {
    address: string;
    pubKeyHash: string;
  }
): Promise<string> {
  const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
  const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
  const unsignedTx = txBuilder.spendingPlutusScriptV3()

  const mintCompilecode = readValidator("mint.mint.mint");
  const storeCompilecode = readValidator("store.store.spend");

  const storeScriptCbor = applyParamsToScript(storeCompilecode, [
    platformPubKeyHash,
    BigInt(1),
    ownerInfo.pubKeyHash
  ]);
  
  const storeScript: PlutusScript = {
    code: storeScriptCbor,
    version: "V3" as "V3",
  };
  
  const storeAddress = serializeAddressObj(
    scriptAddress(
      deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
      platformStakeCredential,
      false,
    ),
    0,
  );
  
  const storeScriptHash = deserializeAddress(storeAddress).scriptHash;

  const mintScriptCbor = applyParamsToScript(mintCompilecode, [
    platformPubKeyHash,
    BigInt(1),
    storeScriptHash,
    platformStakeCredential,
    ownerInfo.pubKeyHash,
  ]);
  const policyId = resolveScriptHash(mintScriptCbor, "V3");

  await Promise.all(
    tokenInfo.map(async ({ assetName, metadata, txHash }) => {
      const referenceTokenId = policyId + CIP68_100(stringToHex(assetName));// -> unit
      const storeUtxo = !isNil(txHash)
        ? await getUtxoForTx(storeAddress, txHash) //txhash khi ma minh muon cap nhat (optional)
        : await getAddressUTXOAsset(storeAddress, referenceTokenId);
      
      if (!storeUtxo) throw new Error("Store UTXO not found");

      unsignedTx
        .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
        .txInInlineDatumPresent()
        .txInRedeemerValue(mConStr0([]))
        .txInScript(storeScriptCbor)
        .txOut(storeAddress, [
          {
            unit: referenceTokenId,
            quantity: "1",
          }
        ])
        .txOutInlineDatumValue(metadataToCip68(metadata));
    }),
  );

  // Add platform fee payment
  unsignedTx
    .txOut(PLATFORM.address, [
      {
        unit: "lovelace",
        quantity: PLATFORM.fee,
      },  
    ])
    .changeAddress(walletAddress)
    .requiredSignerHash(userPubKeyHash) //condition: chi co ng mint moi co the update
   // .requiredSignerHash(ownerInfo.pubKeyHash) 
    .selectUtxosFrom(utxos)
    .txInCollateral(
      collateral.input.txHash, 
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .setNetwork("preprod");
  
  const completedTx = await unsignedTx.complete();
  const signedTx = await wallet.signTx(completedTx, true);
  console.log("Submitting transaction...");
  
  try {
    const txHashUpdate = await wallet.submitTx(signedTx);
    console.log("Transaction submitted successfully!");
    console.log("Update successful! TxHash: " + txHashUpdate);
    return txHashUpdate;
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
}

async function main() {
  try {
   
    const ownerAddress = "addr_test1qp32dhvj6nmhn8qjce8vsv3s0x70rrth7udxy32a7lm5yl7vchlp2ahqwyyfpv4l7fszccrngx2vcmmu5x3d3t3cy2uqpd7ewx";
    const ownerPubKeyHash = deserializeAddress(ownerAddress).pubKeyHash;
    
    const tokenName = "Blockchain";
    const newMetadata = {
      name: tokenName,
      image: "ipfs://bafkreihia6lar2ofmpfyuwwmcog7gexlqvwbb2tuhezpouhi4xpvxjju4m",
      mediaType: "image/jpg",
      description: "Updated metadata for my CIP68 token",
      _pk: ownerPubKeyHash, 
      hex: "updated",
      a: 'b'
    };

    const result = await updateTokens(
      [{ assetName: tokenName, metadata: newMetadata }],
      { address: ownerAddress, pubKeyHash: ownerPubKeyHash }
    );
    
    console.log("Update completed with tx hash:", result);
  } catch (error) {
    console.error("Error updating tokens:", error);
  }
}

// Run the function
main();