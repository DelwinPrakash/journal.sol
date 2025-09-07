import { useWorkSpace } from "@/lib/anchorClient";
import { useQuery } from "@tanstack/react-query";

export default function useJournalAccount(){
    const { program, wallet } = useWorkSpace();

    const getAllJournals = useQuery({
        queryKey: ["journal", "all"],
        queryFn: async () => {
            const all = await program?.account.journalEntry.all();
            return all
                ?.filter(entry => entry.account.isPublic)
                ?.sort((a, b) => {
                    return b.account.createdAt.cmp(a.account.createdAt);
                });
        },
        enabled: !!program && !!wallet?.publicKey
    });

    const getUserJournals = useQuery({
        queryKey: ["journal", "user"],
        queryFn: async () => {
            if (!wallet.publicKey) return [];
            const userJournal = await program?.account.journalEntry.all([{
                memcmp:{
                    offset: 8,
                    bytes: wallet?.publicKey?.toBase58()
                }
            }]);
            return userJournal?.sort((a, b) => b.account.createdAt.cmp(a.account.createdAt));
        },
        enabled: !!program && !!wallet?.publicKey
    });

    return {
        getAllJournals,
        getUserJournals
    }
}