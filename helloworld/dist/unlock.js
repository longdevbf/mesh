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
var adapter_1 = require("../vote/adapter");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var utxos, walletAddress, collateral, scriptUtxo, scriptCbor, signerHash, message, txBuilder, unsignedTx, signedTx, txHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, common_1.wallet.getUtxos()];
                case 1:
                    utxos = _a.sent();
                    return [4 /*yield*/, common_1.wallet.getUsedAddresses()];
                case 2:
                    walletAddress = (_a.sent())[0];
                    return [4 /*yield*/, common_1.wallet.getCollateral()];
                case 3:
                    collateral = (_a.sent())[0];
                    return [4 /*yield*/, adapter_1.blockchainProvider.fetchUTxOs('9c97a43a235a38efa2e7c558168d89bc9a91bbc0c84f799a570aee418e781c3c')];
                case 4:
                    scriptUtxo = _a.sent();
                    console.log("Script Utxo: ", scriptUtxo);
                    scriptCbor = common_1.getScript().scriptCbor;
                    console.log("Script Cbor: ", scriptCbor);
                    signerHash = core_1.deserializeAddress(walletAddress).pubKeyHash;
                    message = "Hello, World!";
                    // get the utxo from the script address of the locked funds
                    //  const txHashFromDesposit = process.argv[2];
                    //  const scriptUtxo = await getUtxoByTxHash('9c97a43a235a38efa2e7c558168d89bc9a91bbc0c84f799a570aee418e781c3c');
                    console.log("Script Utxo: ", scriptUtxo);
                    txBuilder = common_1.getTxBuilder();
                    return [4 /*yield*/, txBuilder
                            .spendingPlutusScript("V3") // we used plutus v3
                            .txIn(// spend the utxo from the script address
                        scriptUtxo.input.txHash, scriptUtxo.input.outputIndex, scriptUtxo.output.amount, scriptUtxo.output.address)
                            .txInScript(scriptCbor)
                            .txInRedeemerValue(core_1.mConStr0([core_1.stringToHex(message)])) // provide the required redeemer value `Hello, World!`
                            .txInDatumValue(core_1.mConStr0([signerHash])) // only the owner of the wallet can unlock the funds
                            .requiredSignerHash(signerHash)
                            .changeAddress(walletAddress)
                            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
                            .selectUtxosFrom(utxos)
                            .complete()];
                case 5:
                    _a.sent();
                    unsignedTx = txBuilder.txHex;
                    return [4 /*yield*/, common_1.wallet.signTx(unsignedTx)];
                case 6:
                    signedTx = _a.sent();
                    return [4 /*yield*/, common_1.wallet.submitTx(signedTx)];
                case 7:
                    txHash = _a.sent();
                    console.log("1 tADA unlocked from the contract at Tx ID: " + txHash);
                    return [2 /*return*/];
            }
        });
    });
}
main();
