import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../dev-wallet.json";
import bs58 from "bs58";
import {  createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

const umi = createUmi("https://devnet.helius-rpc.com/?api-key=71d05d9f-5d94-4548-9137-c6c3d9f69b3e");

let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(wallet));
let signer = createSignerFromKeypair(umi, keypair);

// Set up the signer identity and uploader
umi.use(signerIdentity(signer));
umi.use(irysUploader());


umi.use(mplTokenMetadata());
umi.use(mplToolbox());




(async() => {

const mint = generateSigner(umi);

 const tx = await createNft(umi, {
  mint: mint,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'warrior',
  tokenOwner: signer.publicKey,
  uri: " https://gateway.irys.xyz/2BfGXwto2kyZZXgeySf2Bx6mr9K44Bub9Ur734NN6owW",
}).sendAndConfirm(umi)



console.log(base58.deserialize(tx.signature)[0])
})()