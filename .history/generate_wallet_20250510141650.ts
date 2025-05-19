import { generateMnemonic, MeshWallet, BlockfrostProvider } from '@meshsdk/core';
import { words } from 'lodash';
//nhap module fs cua nodejs de thao tac voi cac tep tin
import fs from 'node:fs';
export const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
async function main() {
  try {
    // Tạo chuỗi mnemonic
    const secret = await MeshWallet.brew();
    console.log("Mnemonic phrase:", secret);
    
    // Tách chuỗi thành mảng các từ
   // const words = secret.split(' ');
    
    // Tạo ví với mảng các từ
    // const wallet = new MeshWallet({
    //   networkId: 0,

    //   key: {
    //     type: 'mnemonic',
    //     words: [words], // Truyền mảng các từ thay vì [secret]
    //   },
    // });
    const wallet = new MeshWallet({
        networkId: 0, // Mạng Cardano: 0 là Testnet (Preview, PreprodPreprod)
        fetcher: blockchainProvider, // Provider để truy vấn blockchain
        submitter: blockchainProvider, // Provider để gửi giao dịch
        key: {
            type: 'mnemonic', // loai 24 ki tu
            words: secret.split(' ')
        },
    });
    
    // Lấy địa chỉ ví
    const addr = await wallet.getChangeAddress();
    console.log("Địa chỉ ví:", addr);
    
    // Thêm thông tin thử nghiệm
    console.log("\nThông tin ví:");
    console.log("--------------------");
    console.log("Network ID: 0 (Testnet)");
    console.log("Số từ mnemonic:", words.length);
    
    // Kiểm tra tính hợp lệ của địa chỉ
    if (addr.startsWith('addr_test1')) {
      console.log("Loại địa chỉ: Testnet");
    } else if (addr.startsWith('addr1')) {
      console.log("Loại địa chỉ: Mainnet");
    }
  } catch (error) {
    console.error("Lỗi khi tạo ví:", error);
  }
}

main();