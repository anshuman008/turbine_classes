import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import bs58 from "bs58";
import { 
  createInitializeInstruction, 
  createInitializeMetadataPointerInstruction, 
  createInitializeMintInstruction, 
  createMint, 
  TOKEN_2022_PROGRAM_ID, 
  TOKEN_PROGRAM_ID,
  getMintLen,
  ExtensionType,
  LENGTH_SIZE,
  TYPE_SIZE
} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const signer = Keypair.fromSecretKey(bs58.decode(wallet));
const mint = Keypair.generate();

// Define metadata
const metadata = {
  name: "anshu",
  symbol: "ANS", 
  uri: "https://ipfs.io/ipfs/bafkreib2ztqs4tcilnfexsnccxcudaubca6oohoi2vhoybsun6f6fmqn6q",
};

// Calculate the space needed for the mint account with metadata pointer extension
const mintLen = getMintLen([ExtensionType.MetadataPointer]);

// Calculate additional space needed for metadata


(async () => {


    const metadataLen = TYPE_SIZE + LENGTH_SIZE + metadata.name.length + 
                   TYPE_SIZE + LENGTH_SIZE + metadata.symbol.length + 
                   TYPE_SIZE + LENGTH_SIZE + metadata.uri.length;

const totalLen = mintLen + metadataLen;

const createMintAccountInstructions = SystemProgram.createAccount({
  fromPubkey: signer.publicKey,
  lamports: await connection.getMinimumBalanceForRentExemption(totalLen),
  newAccountPubkey: mint.publicKey,
  programId: TOKEN_2022_PROGRAM_ID,
  space: totalLen,
});

const initMetadataPointerInstructions =
  createInitializeMetadataPointerInstruction(
    mint.publicKey,
    signer.publicKey,
    mint.publicKey, // we will point to the mint itself as the metadata account
    TOKEN_2022_PROGRAM_ID,
  );

const initMintInstructions = createInitializeMintInstruction(
  mint.publicKey,
  6,
  signer.publicKey,
  signer.publicKey,
  TOKEN_2022_PROGRAM_ID,
);

const initMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  mint: mint.publicKey,
  metadata: mint.publicKey,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  mintAuthority: signer.publicKey,
  updateAuthority: signer.publicKey,
});
  try {
    const transaction = new Transaction().add(
      createMintAccountInstructions,
      initMetadataPointerInstructions,
      initMintInstructions,
      initMetadataInstruction,
    );
    
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      signer,
      mint,
    ]);
    
    console.log("Token created successfully!");
    console.log("Mint address:", mint.publicKey.toBase58());
    console.log("Transaction signature:", signature);
  } catch (error) {
    console.error("Error creating token:", error);
  }
})();