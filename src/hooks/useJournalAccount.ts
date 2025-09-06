import { useWorkSpace } from "@/lib/anchorClient";
import { useQuery } from "@tanstack/react-query";

export default function useJournalAccount(){
    const { program, wallet } = useWorkSpace();

    const getAllJournals = useQuery({
        queryKey: ["journal", "all"],
        queryFn: () => program?.account.journalEntry.all(),
        enabled: !!program && !!wallet?.publicKey
    });

    const getUserJournals = useQuery({
        queryKey: ["journal", "user"],
        queryFn: () => program?.account.journalEntry.all([{
            memcmp:{
                offset: 8,
                bytes: wallet?.publicKey?.toBase58()!
            }
        }]),
        enabled: !!program && !!wallet?.publicKey
    });

    return {
        getAllJournals,
        getUserJournals
    }
}