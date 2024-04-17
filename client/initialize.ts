import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { RAFFLE_PROGRAM_ID, RPC_URL, SIGNER } from ".";
import { SolanaRaffle, IDL } from "../target/types/solana_raffle";
import { findGlobalPda } from "./utils";

const main = async () => {

    const connection = new Connection(RPC_URL);
    const wallet = new Wallet(SIGNER);
    const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed'
    });

    const program = new Program<SolanaRaffle>(IDL, RAFFLE_PROGRAM_ID, provider);

    const globalPda = findGlobalPda();

    const tx = await program.methods.initialize()
        .accounts({
            authority: SIGNER.publicKey,
            globalAccount: globalPda,
            vault: new PublicKey("HK5Tf2wDXjvX1veuESXbcehaAjECcZdfnPCDfrcE7dAt"),
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY
        })
        .rpc();
    console.log(tx);
}

main();