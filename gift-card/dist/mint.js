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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var common_1 = require("@meshsdk/common");
var core_1 = require("@meshsdk/core");
var core_cst_1 = require("@meshsdk/core-cst");
var common_2 = require("./common");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tokenName, tokenNameHex, _a, utxos, walletAddress, collateral, utxo, remainingUtxos, giftValue, minscriptCbor, mintPolicy, redeemCbor, redeemScriptAddr, txBuilder, signedTx, submitTx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tokenName = "Longdzvcl";
                    tokenNameHex = common_1.stringToHex(tokenName);
                    return [4 /*yield*/, common_2.getWalletInfoForTx(common_2.wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, walletAddress = _a.walletAddress, collateral = _a.collateral;
                    utxo = utxos[0];
                    if (utxo === undefined)
                        throw new Error("No UTXOs available");
                    remainingUtxos = utxos.slice(1);
                    giftValue = [
                        {
                            unit: "lovelace",
                            quantity: "10000000"
                        },
                    ];
                    minscriptCbor = core_cst_1.applyParamsToScript(common_2.readValidator("gift_card.gift_card.mint"), [
                        common_1.builtinByteString(tokenNameHex),
                        common_1.outputReference(utxo.input.txHash, utxo.input.outputIndex)
                    ], "JSON");
                    mintPolicy = core_1.resolveScriptHash(minscriptCbor, "V3");
                    redeemCbor = core_cst_1.applyParamsToScript(common_2.readValidator("gift_card.redeem.spend"), [tokenNameHex, mintPolicy]);
                    redeemScriptAddr = core_1.serializePlutusScript({ code: redeemCbor, version: "V3" }).address;
                    txBuilder = common_2.getTxBuilder();
                    return [4 /*yield*/, txBuilder
                            .txIn(utxo.input.txHash, utxo.input.outputIndex, utxo.output.amount, utxo.output.address)
                            .mintPlutusScript("V3")
                            .mint("1", mintPolicy, tokenNameHex)
                            .mintingScript(minscriptCbor)
                            .mintRedeemerValue(common_1.mConStr0([]))
                            .txOut(walletAddress, [
                            { unit: mintPolicy + tokenNameHex, quantity: "1" },
                        ])
                            .txOut(redeemScriptAddr, __spreadArrays(giftValue))
                            .txOutInlineDatumValue([
                            utxo.input.txHash,
                            utxo.input.outputIndex,
                            tokenNameHex,
                        ])
                            .changeAddress(walletAddress)
                            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
                            .selectUtxosFrom(remainingUtxos)
                            .complete()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, common_2.wallet.signTx(txBuilder.txHex)];
                case 3:
                    signedTx = _b.sent();
                    return [4 /*yield*/, common_2.wallet.submitTx(signedTx)];
                case 4:
                    submitTx = _b.sent();
                    console.log("Transaction hash:", submitTx);
                    return [2 /*return*/];
            }
        });
    });
}
main();
