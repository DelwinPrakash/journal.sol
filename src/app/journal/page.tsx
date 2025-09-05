"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useJournalAccount from "@/hooks/useJournalAccount";
import { useWorkSpace } from "@/lib/anchorClient";
import { Loader, PenLine, Trash } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useJournalMutations from "@/hooks/useJournalMutations";


export default function MyJournalPage() {
    const { getUserJournals, getAllJournals } = useJournalAccount();
    const { wallet } = useWorkSpace();
    const { updateMutation, deleteMutation } = useJournalMutations();
    const [editContent, setEditContent] = useState<string>("");
    const [editTitle, setEditTitle] = useState<string>("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleUpdate = async (title: string, content: string) => {
        await updateMutation.mutateAsync({ title, content });
        setIsEditDialogOpen(false);
    }

    const handleDelete = async (title: string) => {
        await deleteMutation.mutateAsync({ title });
        setIsDeleteDialogOpen(false);
    }

    return (
        <div className="pt-20 min-h-screen flex flex-col bg-background p-4">
            <h1 className="text-center text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">My Journals</h1>
            {!wallet?.publicKey ? (
                <div className="flex-1 pb-20 flex items-center justify-center">
                    <p className="text-center text-muted-foreground">Please connect your wallet to view your journals.</p>
                </div>
            ) : (
                getUserJournals.isPending ? (
                    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                ) : (getUserJournals.data!.length === 0) ? (
                    <div className="flex-1 pb-20 flex items-center justify-center">
                        <p className="text-center text-muted-foreground">No journals found. Start by creating a new journal entry!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {getUserJournals.data!.map((entry, index) => (
                            <Card key={index} className="transition duration-300 ease-in-out transform hover:scale-105">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="w-[80%]">
                                            <CardTitle className="text-lg">{entry.account.title}</CardTitle>
                                        </div>
                                        
                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <div
                                                    className="w-[10%] cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                                    onClick={() => {
                                                        setIsEditDialogOpen(true);
                                                        setEditContent(entry.account.content);
                                                        setEditTitle(entry.account.title);
                                                    }}
                                                >
                                                    <PenLine className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-muted-foreground">Edit Journal</DialogTitle>
                                                    <DialogDescription>Edit the content of your journal entry.</DialogDescription>
                                                </DialogHeader>

                                                <textarea
                                                    className="w-full h-32 p-2 border border-gray-300 rounded-md text-muted-foreground"
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                />

                                                <div className="flex justify-end space-x-2 mt-4">
                                                    <Button className="text-muted-foreground cursor-pointer hover:bg-red-500" variant="outline"
                                                        onClick={() => {
                                                            setIsEditDialogOpen(false);
                                                        }}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            handleUpdate(editTitle, editContent);
                                                        }}
                                                    >
                                                        {updateMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Save"}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                            <DialogTrigger asChild>
                                                <div
                                                    className="w-[10%] cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                                    onClick={() => {
                                                        setIsDeleteDialogOpen(true);
                                                        setEditContent(entry.account.content);
                                                        setEditTitle(entry.account.title);
                                                    }}
                                                >
                                                    <Trash className="h-5 w-5 text-red-600" />
                                                </div>
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-muted-foreground">Delete Journal</DialogTitle>
                                                    <DialogDescription>Are you sure you want to delete this journal?</DialogDescription>
                                                </DialogHeader>

                                                <Card>
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <CardTitle className="text-lg">{editTitle}</CardTitle>
                                                        </div>
                                                    </CardHeader>
                                                    
                                                    <CardContent>
                                                        <p className="text-muted-foreground mb-4 line-clamp-3">
                                                            {editContent}
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <div className="flex justify-end space-x-2 mt-4">
                                                    <Button className="text-muted-foreground cursor-pointer hover:bg-gray-900" variant="outline"
                                                        onClick={() => {
                                                            setIsDeleteDialogOpen(false);
                                                        }}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="cursor-pointer bg-red-500 hover:bg-red-600"
                                                        onClick={() => {
                                                            handleDelete(editTitle);
                                                        }}
                                                    >
                                                        {deleteMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        
                                    </div>
                                </CardHeader>
                                
                                <CardContent>
                                    <p className="text-muted-foreground mb-4 line-clamp-3">
                                        {entry.account.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}