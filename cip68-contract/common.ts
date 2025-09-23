import {
  BlockfrostProvider,
  MeshTxBuilder,
  MeshWallet,
  PlutusScript,
  serializePlutusScript,
  UTxO
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
import blueprint from "./plutus.json";
 import plutus from './plutus.json';

export const blockchainProvider = new BlockfrostProvider('preproduHlUjS1ST8kPA9JDjgwDErAl6NiV7jsc');

// wallet for signing transactions
export const wallet = new MeshWallet({
  networkId: 0,
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: 'mnemonic', // loai 24 ki tu
    words: [
      "illness", "tomato", "organ", "credit", "hybrid", "path", "slight", "bomb", "allow", "media", "credit", "virtual", "uncle", "blast", "type", "very", "certain", "join", "feed", "repeat", "elbow", "place", "aim", "oblige"
    ], // Danh sách các từ mnemonic - longdevbf
  },
});

export function getScript() {
  const scriptCbor = applyParamsToScript(
    blueprint.validators[0].compiledCode,
    []
  );
  const script: PlutusScript = {
    code: scriptCbor,
    version: "V3"
  }

  const scriptAddr = serializePlutusScript(
    { code: scriptCbor, version: "V3" }, undefined, 0
  ).address;;


  return { scriptCbor, scriptAddr };
}


export function getTxBuilder() {
  return new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: true,
  });
}

export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
  const utxos = await blockchainProvider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}



export async function getWalletInfoForTx(wallet: any) {
  const utxos = await wallet.getUtxos();
  const walletAddress = (await wallet.getUsedAddresses())[0] ;
  const collateral = (await wallet.getCollateral())[0];
  
  return { utxos, walletAddress, collateral};
}

export async function getUtxoForTx(address: string, txHash: string, wallet: any) {
  const utxos: UTxO[] = await blockchainProvider.fetchAddressUTxOs(address);
  const utxo = utxos.find(function (utxo: UTxO) {
    return utxo.input.txHash === txHash;
  });

  if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
  return utxo;
}

export async function getAddressUTXOAsset(address: string, unit: string, wallet: any) {
  const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
  return utxos[utxos.length - 1];
};

export function readValidator(title: string): string {
    const validator = plutus.validators.find(v => v.title === title);
    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }
    return validator.compiledCode;
  }
export const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        verbose: true,
  });
