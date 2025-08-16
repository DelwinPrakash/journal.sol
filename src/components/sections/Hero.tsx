import React from 'react';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Hero: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Immutable',
      description: 'Your journal entries are stored on the Solana blockchain, ensuring they can never be altered or lost.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built on Solana for ultra-fast transactions and seamless writing experience.',
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'Own your content completely. No central authority can access or modify your personal thoughts.',
    },
  ];

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-foreground">
            Your{' '}
            <span className="gradient-text text-primary">Blockchain</span>
            <br />
            Journal Awaits
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Write, store, and own your thoughts forever on the Solana blockchain. 
            Experience the future of personal journaling with unmatched security and permanence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" size="lg" className="btn-glass text-muted-foreground">
              Store on-chain
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="card-gradient card-elevated hover-lift">
              <CardContent className="p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};