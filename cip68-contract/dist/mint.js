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
var common_1 = require("./common");
// Configuration constants
var PLATFORM_FEE = '1000000';
var TOKEN_NAME = 'Blockchain';
var IMAGE_IPFS_HASH = 'bafkreibktdoly7abv5gqg6xn7gskjliyxw3sqflqldznehbh4r3p522p6a';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, utxos, walletAddress, collateral, userPubKeyHash, exChange, pubkeyExchange, tokenMetadata, mintCompilecode, storeCompilecode, storeScriptCbor, storeScript, storeAddress, storeScriptHash, mintScriptCbor, policyId, hexAssetName, unsignedTx, completedTx, signedTx, txHash, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, common_1.getWalletInfoForTx(common_1.wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, walletAddress = _a.walletAddress, collateral = _a.collateral;
                    userPubKeyHash = core_1.deserializeAddress(walletAddress).pubKeyHash;
                    exChange = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
                    pubkeyExchange = core_1.deserializeAddress(exChange).pubKeyHash;
                    tokenMetadata = {
                        name: TOKEN_NAME,
                        image: IMAGE_IPFS_HASH,
                        mediaType: "image/jpg",
                        description: "My second token",
                        _pk: userPubKeyHash
                    };
                    mintCompilecode = common_1.readValidator("mint.mint.mint");
                    storeCompilecode = common_1.readValidator("store.store.spend");
                    storeScriptCbor = core_1.applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1), userPubKeyHash]);
                    storeScript = {
                        code: storeScriptCbor,
                        version: "V3"
                    };
                    storeAddress = core_1.serializeAddressObj(//-> address store
                    core_1.scriptAddress(core_1.deserializeAddress(core_1.serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash, core_1.deserializeAddress(exChange).stakeCredentialHash, false), 0);
                    storeScriptHash = core_1.deserializeAddress(storeAddress).scriptHash;
                    mintScriptCbor = core_1.applyParamsToScript(mintCompilecode, [
                        pubkeyExchange,
                        BigInt(1),
                        storeScriptHash,
                        core_1.deserializeAddress(exChange).stakeCredentialHash,
                        userPubKeyHash,
                    ]);
                    policyId = core_1.resolveScriptHash(mintScriptCbor, "V3");
                    hexAssetName = core_1.stringToHex(TOKEN_NAME);
                    unsignedTx = common_1.txBuilder.mintPlutusScriptV3();
                    unsignedTx
                        //mint prefix 222
                        .mint("1", policyId, core_1.CIP68_222(hexAssetName))
                        .mintingScript(mintScriptCbor)
                        .mintRedeemerValue(core_1.mConStr0([]))
                        //mint prefix 100
                        .mintPlutusScriptV3()
                        .mint("1", policyId, core_1.CIP68_100(hexAssetName))
                        .mintingScript(mintScriptCbor)
                        .mintRedeemerValue(core_1.mConStr0([]))
                        // Store reference token with metadata at store address
                        .txOut(storeAddress, [
                        {
                            unit: policyId + core_1.CIP68_100(hexAssetName),
                            quantity: "1"
                        }
                    ])
                        .txOutInlineDatumValue(core_1.metadataToCip68(tokenMetadata))
                        // Send user token to wallet
                        .txOut(walletAddress, [
                        {
                            unit: policyId + core_1.CIP68_222(hexAssetName),
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
                        .requiredSignerHash(userPubKeyHash) //-> minh phai la nguoi ki giao dich
                        .selectUtxosFrom(utxos)
                        .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
                        .setNetwork("preprod")
                        .addUtxosFromSelection();
                    return [4 /*yield*/, unsignedTx.complete()];
                case 2:
                    completedTx = _b.sent();
                    return [4 /*yield*/, common_1.wallet.signTx(completedTx, true)];
                case 3:
                    signedTx = _b.sent();
                    return [4 /*yield*/, common_1.wallet.submitTx(signedTx)];
                case 4:
                    txHash = _b.sent();
                    console.log("Transaction submitted successfully!");
                    console.log("Transaction hash:", txHash);
                    return [2 /*return*/, txHash];
                case 5:
                    error_1 = _b.sent();
                    console.error("Error in mint process:", error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function (txHash) { return console.log("Mint completed with hash:", txHash); })["catch"](function (err) { return console.error("Mint failed:", err); });
//npx tsx mint.ts
