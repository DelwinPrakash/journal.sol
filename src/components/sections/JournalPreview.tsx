"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Lock, Eye, Plus, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useJournalMutations from '@/hooks/useJournalMutations';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

export const JournalPreview: React.FC = () => {
  const mockEntries = [
    {
      id: 1,
      title: 'My First Blockchain Entry',
      date: '2024-01-15',
      preview: 'Today I decided to start keeping my journal on the blockchain. The idea of having my thoughts stored permanently and securely is fascinating...',
      isPublic: false,
      tags: ['Personal', 'Blockchain', 'First'],
    },
    {
      id: 2,
      title: 'Learning Solana Development',
      date: '2024-01-14',
      preview: 'Diving deep into Solana smart contracts today. The speed and efficiency of this network is incredible compared to other blockchains...',
      isPublic: true,
      tags: ['Development', 'Learning', 'Solana'],
    },
    {
      id: 3,
      title: 'Thoughts on Decentralization',
      date: '2024-01-13',
      preview: 'The more I learn about decentralized systems, the more I appreciate the freedom they provide. No single entity controlling our data...',
      isPublic: false,
      tags: ['Philosophy', 'Web3', 'Freedom'],
    },
  ];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mounted, setMounted] = useState(false);
  const { createMutation } = useJournalMutations();
  const { publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, [])

  const handleSubmit = () => {
    if(!publicKey){
      toast("Please connect your wallet!");
      return;
    }
    if(title.trim() && content.trim()){
      console.log("Submitting journal entry:", { title, content, publicKey: publicKey.toBase58() });
      
      createMutation.mutate({ title, content });
      
      setTitle("");
      setContent("");
    }
  }

  return (
    <section id="journal" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
            Your <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Digital Journal</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Write, organize, and secure your thoughts on the blockchain. Every entry is immutably stored and completely under your control.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-foreground">Recent Entries</h3>
              <Button className="cursor-pointer bg-gradient-to-r from-purple-700 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>

            {mockEntries.map((entry) => (
              <Card key={entry.id} className="card-elevated hover-lift cursor-pointer">
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {entry.isPublic ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {entry.date}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {entry.preview}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

              </Card>
            ))}

          </div>

          <div className="lg:sticky lg:top-24">
            <Card className="bg-[linear-gradient(135deg,_oklch(0.65_0.27_305_/_0.2),_oklch(0.72_0.27_325_/_0.2))]">
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Write New Entry
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {mounted && (<>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="What's on your mind today?"
                      value={title ?? ""}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      rows={10}
                      placeholder="Start writing your thoughts..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                  </div>
                </>)}
                
                <div className="flex justify-between items-center">
                  {mounted && 
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="public" className="rounded" />
                      <label htmlFor="public" className="text-sm">Make public</label>
                    </div>
                  }
                  <Button onClick={handleSubmit} className={` bg-gradient-to-r from-purple-700 to-purple-600 cursor-pointer`} disabled={!title.trim() || !content.trim() || createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <svg
                          className="animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <Loader className="h-4 w-4 mr-2" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save to Blockchain'
                    )}
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};