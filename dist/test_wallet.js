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
exports.blockchainProvider = void 0;
var core_1 = require("@meshsdk/core");
var fs_1 = require("fs");
var crypto_1 = require("crypto");
exports.blockchainProvider = new core_1.BlockfrostProvider('mainnetLuCM8hMihQj4DmhabGGeSJF2Pjok35PQ');
// Đọc wordlist từ file một lần duy nhất
var wordlist = fs_1["default"].readFileSync('./english.txt', 'utf8').trim().split('\n').map(function (word) { return word.trim(); });
// Tạo mnemonic ngẫu nhiên nhanh
function generateRandomMnemonic() {
    var randomWords = [];
    for (var i = 0; i < 24; i++) {
        randomWords.push(wordlist[crypto_1["default"].randomInt(0, 2048)]);
    }
    return randomWords.join(' ');
}
// Kiểm tra mnemonic hợp lệ
function isValidMnemonic(mnemonic) {
    var bip39 = require('bip39');
    return bip39.validateMnemonic(mnemonic);
}
function findWalletsWithUTXOsOptimized() {
    return __awaiter(this, void 0, void 0, function () {
        var count, validWallets, startTime, i, mnemonic, wallet, address, balances, lovelaceBalance, adaAmount, totalTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 Starting optimized search...");
                    count = 0;
                    validWallets = [];
                    startTime = Date.now();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 100000)) return [3 /*break*/, 5];
                    mnemonic = generateRandomMnemonic();
                    if (!isValidMnemonic(mnemonic))
                        return [3 /*break*/, 4];
                    count++;
                    wallet = new core_1.MeshWallet({
                        networkId: 1,
                        fetcher: exports.blockchainProvider,
                        submitter: exports.blockchainProvider,
                        key: {
                            type: 'mnemonic',
                            words: mnemonic.split(' ')
                        }
                    });
                    return [4 /*yield*/, wallet.getChangeAddress()];
                case 2:
                    address = _a.sent();
                    return [4 /*yield*/, wallet.getBalance()];
                case 3:
                    balances = _a.sent();
                    console.log("\uD83D\uDD0D Testing mnemonic #" + (i + 1) + ": " + mnemonic + " - Address: " + address);
                    // Chỉ kiểm tra có ADA không
                    if ((balances === null || balances === void 0 ? void 0 : balances.length) > 0) {
                        lovelaceBalance = balances.find(function (b) { return b.unit === 'lovelace'; });
                        if (lovelaceBalance && parseInt(lovelaceBalance.quantity) > 0) {
                            adaAmount = (parseInt(lovelaceBalance.quantity) / 1000000).toFixed(6);
                            validWallets.push({
                                index: i,
                                mnemonic: mnemonic,
                                address: address,
                                balances: balances,
                                adaAmount: adaAmount
                            });
                            console.log("\uD83C\uDF89 FOUND #" + validWallets.length + ": " + adaAmount + " ADA");
                        }
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    totalTime = (Date.now() - startTime) / 1000;
                    console.log("\n\uD83D\uDCCA FINAL RESULTS:");
                    console.log("Time: " + totalTime.toFixed(2) + "s");
                    console.log("Valid mnemonics: " + count);
                    console.log("Speed: " + (count / totalTime).toFixed(2) + " wallets/sec");
                    console.log("Wallets with ADA: " + validWallets.length);
                    if (validWallets.length > 0) {
                        console.log("\n\uD83D\uDCB0 JACKPOTS FOUND:");
                        validWallets.forEach(function (wallet, index) {
                            console.log(index + 1 + ". " + wallet.adaAmount + " ADA - " + wallet.mnemonic);
                        });
                    }
                    return [2 /*return*/, validWallets];
            }
        });
    });
}
findWalletsWithUTXOsOptimized();
