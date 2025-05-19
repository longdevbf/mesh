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
exports.mintNFT = void 0;
var core_1 = require("@meshsdk/core");
var plutus_json_1 = require("./plutus.json");
var common_1 = require("./common");
var PLATFORM_FEE = '1000000';
var DEFAULT_EXCHANGE_ADDRESS = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
function readValidator(title) {
    var validator = plutus_json_1["default"].validators.find(function (v) { return v.title === title; });
    if (!validator)
        throw new Error(title + " validator not found.");
    return validator.compiledCode;
}
/**
 * Mint a CIP68 NFT token
 *
 * @param wallet - Connected wallet instance
 * @param tokenName - Name for the NFT
 * @param metadata - Complete metadata object for the NFT (created externally)
 * @param options - Optional parameters (platformFee, exchangeAddress)
 * @returns Transaction hash
 */
function mintNFT(wallet, tokenName, metadata, options) {
    return __awaiter(this, void 0, Promise, function () {
        var platformFee, exChange, _a, utxos, walletAddress, collateral, userPubKeyHash, pubkeyExchange, mintCompilecode, storeCompilecode, storeScriptCbor, storeScript, storeAddress, txBuilder, storeScriptHash, mintScriptCbor, policyId, hexAssetName, unsignedTx, tx, unsigned, signedTx, txHash, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    platformFee = (options === null || options === void 0 ? void 0 : options.platformFee) || PLATFORM_FEE;
                    exChange = (options === null || options === void 0 ? void 0 : options.exchangeAddress) || DEFAULT_EXCHANGE_ADDRESS;
                    return [4 /*yield*/, common_1.getWalletInfoForTx(wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, walletAddress = _a.walletAddress, collateral = _a.collateral;
                    userPubKeyHash = core_1.deserializeAddress(walletAddress).pubKeyHash;
                    pubkeyExchange = core_1.deserializeAddress(exChange).pubKeyHash;
                    mintCompilecode = readValidator("mint.mint.mint");
                    storeCompilecode = readValidator("store.store.spend");
                    storeScriptCbor = core_1.applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1), userPubKeyHash]);
                    storeScript = {
                        code: storeScriptCbor,
                        version: "V3"
                    };
                    console.log("Store ScriptCbor : ", storeScriptCbor);
                    storeAddress = core_1.serializeAddressObj(core_1.scriptAddress(core_1.deserializeAddress(core_1.serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash, core_1.deserializeAddress(exChange).stakeCredentialHash, false), 0);
                    console.log("Store adress: ", storeAddress);
                    txBuilder = new core_1.MeshTxBuilder({
                        fetcher: common_1.blockchainProvider,
                        submitter: common_1.blockchainProvider
                    });
                    storeScriptHash = core_1.deserializeAddress(storeAddress).scriptHash;
                    mintScriptCbor = core_1.applyParamsToScript(mintCompilecode, [
                        pubkeyExchange,
                        BigInt(1),
                        storeScriptHash,
                        core_1.deserializeAddress(exChange).stakeCredentialHash,
                        userPubKeyHash,
                    ]);
                    policyId = core_1.resolveScriptHash(mintScriptCbor, "V3");
                    hexAssetName = core_1.stringToHex(tokenName);
                    unsignedTx = txBuilder.mintPlutusScriptV3();
                    tx = new core_1.Transaction({ initiator: wallet, fetcher: common_1.blockchainProvider, verbose: true })
                        .sendLovelace(exChange, "10000000");
                    return [4 /*yield*/, tx.build()];
                case 2:
                    unsigned = _b.sent();
                    return [4 /*yield*/, wallet.signTx(unsigned)];
                case 3:
                    signedTx = _b.sent();
                    return [4 /*yield*/, wallet.submitTx(signedTx)];
                case 4:
                    txHash = _b.sent();
                    // // Complete, sign, and submit
                    // const completedTx = await unsignedTx.complete();
                    // const signedTx = await wallet.signTx(completedTx, true);
                    // const txHash = await wallet.submitTx(signedTx);
                    return [2 /*return*/, txHash];
                case 5:
                    error_1 = _b.sent();
                    console.error("Mint error:", error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.mintNFT = mintNFT;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var walletA, addr, userPubkeyHash, tokenName, metadata, txId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    walletA = common_1.wallet;
                    return [4 /*yield*/, walletA.getChangeAddress()];
                case 1:
                    addr = _a.sent();
                    userPubkeyHash = core_1.deserializeAddress(addr).pubKeyHash;
                    tokenName = "Farmer";
                    metadata = {
                        name: tokenName,
                        image: "ipfs://bafkreibktdoly7abv5gqg6xn7gskjliyxw3sqflqldznehbh4r3p522p6a",
                        mediaType: "image/jpg",
                        description: "My second  CIP68 token DID",
                        _pk: userPubkeyHash,
                        hex: "kasjdiuopwipodpeoiwopioeewppoife"
                    };
                    return [4 /*yield*/, mintNFT(common_1.wallet, tokenName, metadata)];
                case 2:
                    txId = _a.sent();
                    console.log("TxId: ", txId);
                    return [2 /*return*/];
            }
        });
    });
}
main();
