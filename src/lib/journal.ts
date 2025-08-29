import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWorkSpace } from "@/lib/anchorClient"
import { PROGRAM_ID } from "@/utils/constants";

interface JournalInterface {
    owner: PublicKey,
    title: string,
    content: string
}

function getJournalPDA(title: string, owner: PublicKey){
    return PublicKey.findProgramAddressSync(
        [Buffer.from(title), owner.toBuffer()],
        PROGRAM_ID
    );
}

export async function createJournal(title: string, content: string) {
    const { program, wallet } = useWorkSpace();
    const [journalPDA] = getJournalPDA(title, wallet.publicKey!);

    await program?.methods
        .initializeJournal(title, content)
        .accounts({
            journalEntry: journalPDA,
            owner: wallet.publicKey!,
            systemProgram: SystemProgram.programId
        })
        .rpc();
}

export async function updateJournal(title: string, content: string){
    const { program, wallet } = useWorkSpace();
    const [journalPDA] = getJournalPDA(title, wallet.publicKey!);

    await program?.methods
        .updateJournalEntry(content, title)
        .accounts({
            journalEntry: journalPDA,
            owner: wallet.publicKey!,
            systemProgram: SystemProgram.programId
        })
        .rpc();
}

export async function deleteJournal(title: string){
    const { program, wallet } = useWorkSpace();
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