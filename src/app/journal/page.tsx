"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useJournalAccount from "@/hooks/useJournalAccount";
import { useWorkSpace } from "@/lib/anchorClient";
import { Loader } from "lucide-react";

export default function MyJournalPage() {
    const { getUserJournals } = useJournalAccount();
    const { wallet } = useWorkSpace();
    
    return (
        <div className="pt-20 min-h-screen flex flex-col bg-background p-3">
            <h1 className="text-center text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">My Journals</h1>
            {!wallet?.publicKey ? (
                <p className="text-center text-muted-foreground">Please connect your wallet to view your journals.</p>
            ) : (
                getUserJournals.isPending ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                ) : (getUserJournals.data!.length === 0) ? (
                    <p className="text-center text-muted-foreground">No journals found. Start by creating a new journal entry!</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {getUserJournals.data!.map((entry, index) => (
                            <Card key={index} className="card-elevated hover-lift cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{entry.account.title}</CardTitle>
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