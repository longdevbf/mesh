"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@meshsdk/core");
var lodash_1 = require("lodash");
var plutus_json_1 = require("./plutus.json");
var common_1 = require("./common");
// Platform constants - defined once for the whole application
var PLATFORM = {
    address: "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6",
    fee: "1000000",
    network: "preprod"
};
// Calculate platform derived values
var platformPubKeyHash = core_1.deserializeAddress(PLATFORM.address).pubKeyHash;
var platformStakeCredential = core_1.deserializeAddress(PLATFORM.address).stakeCredentialHash;
// Blockchain provider
var blockchainProvider = new core_1.BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
// Helper functions
function readValidator(title) {
    var validator = plutus_json_1["default"].validators.find(function (v) { return v.title === title; });
    if (!validator)
        throw new Error(title + " validator not found.");
    return validator.compiledCode;
}
function getUtxoForTx(address, txHash) {
    return __awaiter(this, void 0, Promise, function () {
        var utxos, utxo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchainProvider.fetchAddressUTxOs(address)];
                case 1:
                    utxos = _a.sent();
                    utxo = utxos.find(function (utxo) { return utxo.input.txHash === txHash; });
                    if (!utxo)
                        throw new Error("No UTXOs found for txHash: " + txHash);
                    return [2 /*return*/, utxo];
            }
        });
    });
}
function getAddressUTXOAsset(address, unit) {
    return __awaiter(this, void 0, Promise, function () {
        var utxos, allUtxos, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, blockchainProvider.fetchAddressUTxOs(address, unit)];
                case 1:
                    utxos = _a.sent();
                    if (!(utxos.length === 0)) return [3 /*break*/, 3];
                    // Try searching all UTXOs at the address if specific asset not found
                    console.log("Asset not found with direct query, checking all UTXOs at address...");
                    return [4 /*yield*/, blockchainProvider.fetchAddressUTxOs(address)];
                case 2:
                    allUtxos = _a.sent();
                    console.log("Found " + allUtxos.length + " UTXOs at " + address);
                    // Log all assets in these UTXOs
                    console.log("Listing all assets in these UTXOs:");
                    allUtxos.forEach(function (utxo, index) {
                        console.log("UTXO " + (index + 1) + " (" + utxo.input.txHash + "):");
                        utxo.output.amount.forEach(function (asset) {
                            console.log("- " + asset.unit + ": " + asset.quantity);
                        });
                    });
                    throw new Error("No UTXOs found with asset: " + unit);
                case 3:
                    console.log("Found " + utxos.length + " UTXOs with the asset");
                    console.log("Found UTXO: " + utxos[utxos.length - 1].input.txHash);
                    return [2 /*return*/, utxos[utxos.length - 1]];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching UTXOs:", error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Cập nhật token CIP68
 * @param tokenInfo Thông tin token cần cập nhật
 * @param ownerInfo Thông tin người sở hữu gốc token
 * @returns Transaction hash
 */
function updateTokens(wallet, tokenInfo, ownerInfo) {
    return __awaiter(this, void 0, Promise, function () {
        var _a, utxos, walletAddress, collateral, userPubKeyHash, unsignedTx, mintCompilecode, storeCompilecode, storeScriptCbor, storeScript, storeAddress, storeScriptHash, mintScriptCbor, policyId, completedTx, signedTx, txHashUpdate, error_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Starting token update process...");
                    return [4 /*yield*/, common_1.getWalletInfoForTx(wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, walletAddress = _a.walletAddress, collateral = _a.collateral;
                    userPubKeyHash = core_1.deserializeAddress(walletAddress).pubKeyHash;
                    console.log("Current user wallet address:", walletAddress);
                    console.log("Current user pubKeyHash:", userPubKeyHash);
                    unsignedTx = new core_1.MeshTxBuilder({
                        fetcher: blockchainProvider,
                        submitter: blockchainProvider,
                        verbose: true
                    });
                    mintCompilecode = readValidator("mint.mint.mint");
                    storeCompilecode = readValidator("store.store.spend");
                    storeScriptCbor = core_1.applyParamsToScript(storeCompilecode, [
                        platformPubKeyHash,
                        BigInt(1),
                        ownerInfo.pubKeyHash
                    ]);
                    storeScript = {
                        code: storeScriptCbor,
                        version: "V3"
                    };
                    storeAddress = core_1.serializeAddressObj(core_1.scriptAddress(core_1.deserializeAddress(core_1.serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash, platformStakeCredential, false), 0);
                    console.log("Store address:", storeAddress);
                    storeScriptHash = core_1.deserializeAddress(storeAddress).scriptHash;
                    mintScriptCbor = core_1.applyParamsToScript(mintCompilecode, [
                        platformPubKeyHash,
                        BigInt(1),
                        storeScriptHash,
                        platformStakeCredential,
                        ownerInfo.pubKeyHash,
                    ]);
                    policyId = core_1.resolveScriptHash(mintScriptCbor, "V3");
                    console.log("Policy ID:", policyId);
                    console.log("Building transaction...");
                    // Process each token update
                    return [4 /*yield*/, Promise.all(tokenInfo.map(function (_a) {
                            var assetName = _a.assetName, metadata = _a.metadata, txHash = _a.txHash;
                            return __awaiter(_this, void 0, void 0, function () {
                                var referenceTokenId, storeUtxo, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            console.log("Asset name (hex): " + core_1.stringToHex(assetName));
                                            referenceTokenId = policyId + core_1.CIP68_100(core_1.stringToHex(assetName));
                                            console.log("Reference token ID: " + referenceTokenId);
                                            console.log("Searching for asset " + referenceTokenId + " at address " + storeAddress);
                                            if (!!lodash_1.isNil(txHash)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, getUtxoForTx(storeAddress, txHash)];
                                        case 1:
                                            _b = _c.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, getAddressUTXOAsset(storeAddress, referenceTokenId)];
                                        case 3:
                                            _b = _c.sent();
                                            _c.label = 4;
                                        case 4:
                                            storeUtxo = _b;
                                            if (!storeUtxo)
                                                throw new Error("Store UTXO not found");
                                            // Make sure metadata has _pk field set to owner's pubKeyHash
                                            if (!metadata._pk) {
                                                console.log("Adding owner pubKeyHash to metadata _pk field");
                                                metadata._pk = ownerInfo.pubKeyHash;
                                            }
                                            // Build token update transaction
                                            unsignedTx
                                                .spendingPlutusScriptV3()
                                                .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
                                                .txInInlineDatumPresent()
                                                .txInRedeemerValue(core_1.mConStr0([]))
                                                .txInScript(storeScriptCbor)
                                                .txOut(storeAddress, [
                                                {
                                                    unit: referenceTokenId,
                                                    quantity: "1"
                                                }
                                            ])
                                                .txOutInlineDatumValue(core_1.metadataToCip68(metadata));
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }))];
                case 2:
                    // Process each token update
                    _b.sent();
                    // Add platform fee payment
                    unsignedTx
                        .txOut(PLATFORM.address, [
                        {
                            unit: "lovelace",
                            quantity: "1000000"
                        },
                    ])
                        .changeAddress(walletAddress)
                        .requiredSignerHash(userPubKeyHash)
                        // IMPORTANT: Owner must sign the tx
                        .selectUtxosFrom(utxos)
                        .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
                        .setNetwork("preprod");
                    // Complete transaction
                    console.log("Completing transaction...");
                    return [4 /*yield*/, unsignedTx.complete()];
                case 3:
                    completedTx = _b.sent();
                    console.log("txBodyJson", JSON.stringify(completedTx));
                    console.log("Signing transaction...");
                    return [4 /*yield*/, wallet.signTx(completedTx, true)];
                case 4:
                    signedTx = _b.sent();
                    console.log("Submitting transaction...");
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, wallet.submitTx(signedTx)];
                case 6:
                    txHashUpdate = _b.sent();
                    console.log("Transaction submitted successfully!");
                    console.log("Update successful! TxHash: " + txHashUpdate);
                    return [2 /*return*/, txHashUpdate];
                case 7:
                    error_2 = _b.sent();
                    console.error("Error submitting transaction:", error_2);
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = updateTokens;
