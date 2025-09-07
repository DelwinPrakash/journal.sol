import { PublicKey, SystemProgram } from "@solana/web3.js";
import { PROGRAM_ID } from "@/utils/constants";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";

function getJournalPDA(title: string, owner: PublicKey){
    return PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        PROGRAM_ID
    );
}

export async function createJournal(title: string, content: string, isPublic: boolean, program: Program) {
    await program?.methods.initializeJournal(title, content, isPublic).rpc();
}

export async function updateJournal(title: string, content: string, program: Program , wallet: WalletContextState){
    const [journalPDA] = getJournalPDA(title, wallet.publicKey!);

    await program?.methods
        .updateJournalEntry(title, content)
        .accounts({
            journalEntry: journalPDA,
            owner: wallet.publicKey!,
            systemProgram: SystemProgram.programId
        })
        .rpc();
}

export async function deleteJournal(title: string, program: Program, wallet: WalletContextState){
    const [journalPDA] = getJournalPDA(title, wallet.publicKey!);

    await program?.methods
        .deleteJournalEntry(title)
        .accounts({
            journalEntry: journalPDA,
            owner: wallet.publicKey!,
            systemProgram: SystemProgram.programId
        })
        .rpc();
}