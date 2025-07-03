import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../dev-wallet.json";
import bs58 from "bs58"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";
import path, { dirname } from "path";

const umi = createUmi("https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e");

let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(wallet));
let signer = createSignerFromKeypair(umi,keypair);



umi.use(irysUploader());
umi.use(signerIdentity(signer));


(async() => {
  
    try{
       const image = fs.readFileSync(path.join(__dirname, "warrior.png") )

       const genricfile = createGenericFile(image,"nft.png", {contentType: "image/png"});

       const res = await umi.uploader.upload([genricfile]);


       console.log("here is the image uri --", res[0]);

    }
    catch(e){
        console.log("something webt wrong!");
    }

})();
