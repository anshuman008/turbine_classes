import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../dev-wallet.json";
import bs58 from "bs58";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";
import path, { dirname } from "path";

const umi = createUmi("https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e");

let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(wallet));
let signer = createSignerFromKeypair(umi, keypair);

// Set up the signer identity and uploader
umi.use(signerIdentity(signer));
umi.use(irysUploader());

// Fixed variable name (was imageUri[0] but variable was imageuri)
let imageUri = "https://gateway.irys.xyz/8UotoB9n65bGuz949DeiN6qQRn8EQsRQaNxQKnkN5igd";

const metadata = {
  "name": "doom",
  "description": "DOOM THE TERMINATOR",
  "image": imageUri, // Fixed: was imageUri[0], now just imageUri
  "attributes": [
    {
      "trait_type": "warrior",
      "value": "warrior01"
    },
  ],
  "properties": {
    "files": [
      {
        "uri": imageUri, // Fixed: was imageUri[0], now just imageUri
        "type": "image/png"
      }
    ],
    "category": "image"
  }
};

(async () => {
  try {
    const metadataUri = await umi.uploader.uploadJson(metadata);
    console.log("Metadata uploaded successfully:", metadataUri);

    console.log(imageUri);
  } catch (err) {
    console.error("Error uploading metadata:", err);
    throw new Error(err as any);
  }
})(); // Fixed: added parentheses to immediately invoke the function