import { MeshWallet, BlockfrostProvider } from '@meshsdk/core';
import fs from 'fs';
import crypto from 'crypto';

export const blockchainProvider = new BlockfrostProvider('mainnetLuCM8hMihQj4DmhabGGeSJF2Pjok35PQ');

// Đọc wordlist từ file một lần duy nhất
const wordlist = fs.readFileSync('./english.txt', 'utf8').trim().split('\n').map(word => word.trim());

// Tạo mnemonic ngẫu nhiên nhanh
function generateRandomMnemonic(): string {
    const randomWords: string[] = [];
    for (let i = 0; i < 24; i++) {
        randomWords.push(wordlist[crypto.randomInt(0, 2048)]);
    }
    return randomWords.join(' ');
}

// Kiểm tra mnemonic hợp lệ
function isValidMnemonic(mnemonic: string): boolean {
    const bip39 = require('bip39');
    return bip39.validateMnemonic(mnemonic);
}

async function findWalletsWithUTXOsOptimized() {
    console.log("🚀 Starting optimized search...");
    let count = 0;
   const validWallets: Array<{
        index: number,
        mnemonic: string,
        address: string,
        balances: any[],
        adaAmount: string
    }> = [];
    const startTime = Date.now();
    
    for(let i = 0; i < 100000; i++) {
        const mnemonic = generateRandomMnemonic();
      
        
        if (!isValidMnemonic(mnemonic)) continue;
        
        count++;
        
        const wallet = new MeshWallet({
            networkId: 1,
            fetcher: blockchainProvider,
            submitter: blockchainProvider,
            key: {
                type: 'mnemonic',
                words: mnemonic.split(' ')
            },
        });
        
        const address = await wallet.getChangeAddress();
        const balances = await wallet.getBalance();
        console.log(`🔍 Testing mnemonic #${i + 1}: ${mnemonic} - Address: ${address}`);
        // Chỉ kiểm tra có ADA không
        if (balances?.length > 0) {
            const lovelaceBalance = balances.find(b => b.unit === 'lovelace');
            if (lovelaceBalance && parseInt(lovelaceBalance.quantity) > 0) {
                const adaAmount = (parseInt(lovelaceBalance.quantity) / 1000000).toFixed(6);
                validWallets.push({
                    index: i,
                    mnemonic,
                    address,
                    balances,
                    adaAmount
                });
                
                
                console.log(`🎉 FOUND #${validWallets.length}: ${adaAmount} ADA`);
            }
        }
        
        
    }
    
    // Kết quả cuối cùng
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`Time: ${totalTime.toFixed(2)}s`);
    console.log(`Valid mnemonics: ${count}`);
    console.log(`Speed: ${(count / totalTime).toFixed(2)} wallets/sec`);
    console.log(`Wallets with ADA: ${validWallets.length}`);
    
    if (validWallets.length > 0) {
        console.log(`\n💰 JACKPOTS FOUND:`);
        validWallets.forEach((wallet, index) => {
            console.log(`${index + 1}. ${wallet.adaAmount} ADA - ${wallet.mnemonic}`);
        });
    }
    
    return validWallets;
}
findWalletsWithUTXOsOptimized();