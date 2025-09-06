import { useWorkSpace } from "@/lib/anchorClient";
import { createJournal, deleteJournal, updateJournal } from "@/lib/journal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useJournalMutations(){

    const { program, wallet } = useWorkSpace();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationKey: ["journalEntry", "create"],
        mutationFn: ({title, content, isPublic}: {title: string, content: string, isPublic: boolean}) => createJournal(title, content, isPublic, program),
        onSuccess: sign => toast.success("Journal created successfully ", sign!),
        onError: error => toast.error(`Error creating journal: ${error.message}`)
    });

    const updateMutation = useMutation({
        mutationKey: ["journalEntry", "update"],
        mutationFn: ({title, content}: {title: string, content: string}) => updateJournal(title, content, program, wallet),
        onSuccess: sign => {
            toast.success("Journal updated successfully ", sign!);
            queryClient.invalidateQueries({
                queryKey: ["journal", "user"],
            })
        },
        onError: error => toast.error(`Error updating journal: ${error.message}`)
    })

    const deleteMutation = useMutation({
        mutationKey: ["journalEntry", "delete"],
        mutationFn: ({title}: {title: string}) => deleteJournal(title, program, wallet),
        onSuccess: sign => {
            toast.success("Journal deleted successfully ", sign!);
            queryClient.invalidateQueries({
                queryKey: ["journal", "user"],
            })
        },
        onError: error => toast.error(`Error deleting journal: ${error.message}`)
    })

    return {
        createMutation,
        updateMutation,
        deleteMutation
    }
}