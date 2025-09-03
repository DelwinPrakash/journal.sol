import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWorkSpace } from "@/lib/anchorClient"
import { PROGRAM_ID } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

function getJournalPDA(title: string, owner: PublicKey){
    return PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        PROGRAM_ID
    );
}

export async function   createJournal(title: string, content: string, program: any) {
    await program?.methods.initializeJournal(title, content).rpc();
}

export async function updateJournal(title: string, content: string, program: any, wallet: any){
    const [journalPDA] = getJournalPDA(title, wallet.publicKey!);
    console.log("Computed PDA:", journalPDA.toBase58());

    await program?.methods
        .updateJournalEntry(content, title)
        .accounts({
            journalEntry: journalPDA,
            owner: wallet.publicKey!,
            systemProgram: SystemProgram.programId
        })
        .rpc();
}

export async function deleteJournal(title: string, program: any, wallet: any){
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