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
var adapter_1 = require("./adapter");
function voting() {
    return __awaiter(this, void 0, Promise, function () {
        var txHash, _a, utxos, addrCurrent, collateral, pubkeyVoter, rewardAddress, compileCode, scriptCbor, drep, scriptAddr, text, txBuilder, compiledTx, signedTx, txId, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    txHash = "40c2a42fe324759a640dcfddbc69ef2e3b7fe5a998af8d6660359772bf44c9dc";
                    return [4 /*yield*/, adapter_1.getWalletInfoForTx(adapter_1.wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, addrCurrent = _a.walletAddress, collateral = _a.collateral;
                    pubkeyVoter = core_1.deserializeAddress(addrCurrent).pubKeyHash;
                    return [4 /*yield*/, adapter_1.wallet.getRewardAddresses()];
                case 2:
                    rewardAddress = _b.sent();
                    console.log("Reward Address: ", rewardAddress);
                    compileCode = adapter_1.readValidator("voting.vote.vote");
                    scriptCbor = core_1.applyParamsToScript(compileCode, []);
                    return [4 /*yield*/, adapter_1.wallet.getPubDRepKey()];
                case 3:
                    drep = _b.sent();
                    console.log("DRep: ", drep);
                    scriptAddr = core_1.serializePlutusScript({
                        code: scriptCbor,
                        version: "V3"
                    }, undefined, 0).address;
                    return [4 /*yield*/, adapter_1.blockchainProvider.fetchAccountInfo(addrCurrent)];
                case 4:
                    text = _b.sent();
                    console.log(text);
                    txBuilder = adapter_1.getTxBuilder();
                    return [4 /*yield*/, txBuilder
                            .votePlutusScriptV3()
                            .vote({
                            type: "DRep",
                            drepId: pubkeyVoter
                        }, {
                            txHash: txHash,
                            txIndex: 0
                        }, {
                            voteKind: "Yes",
                            anchor: {
                                anchorUrl: "https://www.google.com",
                                anchorDataHash: "40c2a42fe324759a640dcfddbc69ef2e3b7fe5a998af8d6660359772bf44c9dc00"
                            }
                        })
                            .txOut(scriptAddr, [
                            {
                                unit: "lovelace",
                                quantity: "1000000"
                            }
                        ])
                            .voteRedeemerValue(core_1.mConStr0([]))
                            .voteTxInReference(txHash, 0)
                            .txIn(collateral.input.txHash, collateral.input.outputIndex)
                            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
                            .voteScript(scriptCbor)
                            .selectUtxosFrom(utxos)
                            .changeAddress(addrCurrent)
                            .setNetwork("preprod")];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, txBuilder.complete()];
                case 6:
                    compiledTx = _b.sent();
                    return [4 /*yield*/, adapter_1.wallet.signTx(compiledTx, true)];
                case 7:
                    signedTx = _b.sent();
                    return [4 /*yield*/, adapter_1.wallet.submitTx(signedTx)];
                case 8:
                    txId = _b.sent();
                    return [2 /*return*/, txId || " "];
                case 9:
                    e_1 = _b.sent();
                    console.log("Error", e_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, voting()];
                case 1:
                    tx = _a.sent();
                    console.log("Transaction ID: ", tx);
                    return [2 /*return*/];
            }
        });
    });
}
main();
