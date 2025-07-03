import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import bs58 from "bs58";
import { createMint } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

(async() => {

    const signer = Keypair.fromSecretKey(bs58.decode(wallet));

    console.log("here is the user pubkey: ", signer.publicKey.toBase58())
  try{
      const mint = await createMint(
        connection,
        signer,
        signer.publicKey,
        null,
        6
    );


    console.log("here is the mint!", mint.toBase58());
  }
  catch(e){
    console.log("Oops something went wrong!!",e);
  }

})();