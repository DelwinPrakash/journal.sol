import { WalletContextState } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import type { Crud } from "@/utils/types/crud";

export async function createJournal(title: string, content: string, isPublic: boolean, program: Program<Crud>) {
    await program?.methods.initializeJournal(title, content, isPublic).rpc();
}

export async function updateJournal(title: string, content: string, program: Program<Crud>){
    await program?.methods.updateJournalEntry(title, content).rpc();
}

export async function deleteJournal(title: string, program: Program<Crud>){
    await program?.methods.deleteJournalEntry(title).rpc();
}