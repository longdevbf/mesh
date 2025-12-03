"use strict";
exports.__esModule = true;
exports.wallet = exports.blockchainProvider = void 0;
var core_1 = require("@meshsdk/core");
exports.blockchainProvider = new core_1.BlockfrostProvider('preprodhSCpRguTEGct8iqAsKA6Ko0oF010Sepq');
// wallet for signing transactions
exports.wallet = new core_1.MeshWallet({
    networkId: 0,
    fetcher: exports.blockchainProvider,
    submitter: exports.blockchainProvider,
    key: {
        type: 'mnemonic',
        words: [
            "illness", "tomato", "organ", "credit", "hybrid", "path", "slight", "bomb", "allow", "media", "credit", "virtual", "uncle", "blast", "type", "very", "certain", "join", "feed", "repeat", "elbow", "place", "aim", "oblige"
        ]
    }
});
