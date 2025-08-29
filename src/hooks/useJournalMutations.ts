import { createJournal, deleteJournal, updateJournal } from "@/lib/journal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useJournalMutations(){

    const createMutation = useMutation({
        mutationKey: ["journalEntry", "create"],
        mutationFn: ({title, content}: {title: string, content: string}) => createJournal(title, content),
        onSuccess: sign => toast.success("Journal created successfully ", sign!),
        onError: error => toast.error(`Error creating journal: ${error.message}`)
    });

    const updateMutation = useMutation({
        mutationKey: ["journalEntry", "update"],
        mutationFn: ({title, content}: {title: string, content: string}) => updateJournal(title, content),
        onSuccess: sign => toast.success("Journal updated successfully ", sign!),
        onError: error => toast.error(`Error updating journal: ${error.message}`)
    })

    const deleteMutation = useMutation({
        mutationKey: ["journalEntry", "delete"],
        mutationFn: ({title}: {title: string}) => deleteJournal(title),
        onSuccess: sign => toast.success("Journal deleted successfully ", sign!),
        onError: error => toast.error(`Error deleting journal: ${error.message}`)
    })

    return {
        createMutation,
        updateMutation,
        deleteMutation
    }

}