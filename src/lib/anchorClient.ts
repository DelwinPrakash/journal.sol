import { AnchorProvider, Program } from "@coral-xyz/anchor"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useMemo } from "react";
import idl from "@/utils/idl/idl.json";
import type { Crud } from "@/utils/types/crud";
import { PROGRAM_ID } from "@/utils/constants";
import { Connection } from "@solana/web3.js";

export const useWorkSpace = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        if(!wallet || !wallet.publicKey) return;

        return new AnchorProvider(connection as Connection, wallet as any, { commitment: "processed", preflightCommitment: "processed"})
    }, [connection, wallet]);


    const program = useMemo(() => {
        if (!provider) return;

        return new Program<Crud>(idl as Crud, provider);
    }, [provider, PROGRAM_ID]);

    return {provider, program, wallet};
}