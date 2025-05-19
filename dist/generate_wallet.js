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
var lodash_1 = require("lodash");
exports.blockchainProvider = new core_1.BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var secret, wallet, addr, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, core_1.MeshWallet.brew()];
                case 1:
                    secret = _a.sent();
                    console.log("Mnemonic phrase:", secret);
                    wallet = new core_1.MeshWallet({
                        networkId: 0,
                        fetcher: exports.blockchainProvider,
                        submitter: exports.blockchainProvider,
                        key: {
                            type: 'mnemonic',
                            words: secret
                        }
                    });
                    return [4 /*yield*/, wallet.getChangeAddress()];
                case 2:
                    addr = _a.sent();
                    console.log("Địa chỉ ví:", addr);
                    // Thêm thông tin thử nghiệm
                    console.log("\nThông tin ví:");
                    console.log("--------------------");
                    console.log("Network ID: 0 (Testnet)");
                    console.log("Số từ mnemonic:", lodash_1.words.length);
                    // Kiểm tra tính hợp lệ của địa chỉ
                    if (addr.startsWith('addr_test1')) {
                        console.log("Loại địa chỉ: Testnet");
                    }
                    else if (addr.startsWith('addr1')) {
                        console.log("Loại địa chỉ: Mainnet");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Lỗi khi tạo ví:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
