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
var metadata_1 = require("./metadata");
var recipients_1 = require("./recipients");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var changeAddress, forgingScript, policyId, _a, _b, utxos, txBuilder, combinedMetadata, recipient, recipientAddress, assetNames, _i, assetNames_1, assetName, assetMetadata, assetNameHex, fullMetadata, unsignedTx, signedTx, txHash;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, common_1.wallet.getChangeAddress()];
                case 1:
                    changeAddress = _d.sent();
                    forgingScript = core_1.ForgeScript.withOneSignature(changeAddress);
                    policyId = core_1.resolveScriptHash(forgingScript);
                    _b = (_a = console).log;
                    return [4 /*yield*/, common_1.wallet.getBalance()];
                case 2:
                    _b.apply(_a, [_d.sent()]);
                    return [4 /*yield*/, common_1.wallet.getUtxos()];
                case 3:
                    utxos = _d.sent();
                    console.log(utxos);
                    txBuilder = new core_1.MeshTxBuilder({
                        fetcher: common_1.blockchainProvider,
                        submitter: common_1.blockchainProvider,
                        verbose: true
                    });
                    combinedMetadata = {};
                    // Xử lý mint cho từng recipient
                    for (recipient in recipients_1.recipients) {
                        recipientAddress = recipient;
                        assetNames = recipients_1.recipients[recipient];
                        if (Array.isArray(assetNames)) {
                            for (_i = 0, assetNames_1 = assetNames; _i < assetNames_1.length; _i++) {
                                assetName = assetNames_1[_i];
                                assetMetadata = metadata_1.metadata[assetName];
                                if (!assetMetadata) {
                                    console.warn("No metadata found for asset: " + assetName);
                                    continue;
                                }
                                // Thêm metadata vào object tổng hợp
                                combinedMetadata[assetName] = assetMetadata;
                                assetNameHex = core_1.stringToHex(assetName);
                                txBuilder
                                    .mint("1", policyId, assetNameHex)
                                    .mintingScript(forgingScript)
                                    .txOut(recipientAddress, [
                                    { unit: policyId + assetNameHex, quantity: "1" }
                                ]);
                                console.log("Minting " + assetName + " for " + recipientAddress);
                            }
                        }
                    }
                    fullMetadata = (_c = {},
                        _c[policyId] = combinedMetadata,
                        _c);
                    console.log("Combined Metadata:", JSON.stringify(fullMetadata, null, 2));
                    return [4 /*yield*/, txBuilder
                            .metadataValue("721", fullMetadata)
                            .changeAddress(changeAddress)
                            .selectUtxosFrom(utxos)
                            .complete()];
                case 4:
                    unsignedTx = _d.sent();
                    return [4 /*yield*/, common_1.wallet.signTx(unsignedTx)];
                case 5:
                    signedTx = _d.sent();
                    return [4 /*yield*/, common_1.wallet.submitTx(signedTx)];
                case 6:
                    txHash = _d.sent();
                    console.log("Mint Successful!");
                    console.log("TxHash: " + txHash);
                    return [2 /*return*/];
            }
        });
    });
}
main();
//npx tsx mintnfts.ts
