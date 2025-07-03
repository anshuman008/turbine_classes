import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import bs58 from "bs58";
import { createInitializeInstruction, createMint } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");



export interface InitializeInstructionArgs {
  programId: PublicKey;
  metadata: PublicKey;
  updateAuthority: PublicKey;
  mint: PublicKey;
  mintAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
}

(async() => {

    const signer = Keypair.fromSecretKey(bs58.decode(wallet));

    console.log("here is the user pubkey: ", signer.publicKey.toBase58())
  try{


     const balance = await connection.getBalance(signer.publicKey);

     console.log("here is the user pubkey: ", balance/LAMPORTS_PER_SOL);



     
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