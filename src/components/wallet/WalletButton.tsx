"use client";

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WalletButton: React.FC = () => {
  return (
    <div className="wallet-adapter-button-wrapper">
      <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-primary-glow !text-primary-foreground !border-0 !rounded-lg !px-4 !py-2 !font-medium !transition-all !duration-300 hover:!shadow-lg hover:!scale-105" />
    </div>
  );
};

export const CustomWalletButton: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <Button
        variant="outline"
        onClick={disconnect}
        className="hover:bg-white/20 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {formatAddress(publicKey.toString())}
      </Button>
    );
  }else{
    return (
      <Button
        variant="outline"
        onClick={() => setVisible(true)}
        className="hover:bg-white/20 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );

  }

  // return (
  //   <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-primary-glow !text-primary-foreground !border-0 !rounded-lg !px-6 !py-3 !font-medium !transition-all !duration-300 hover:!shadow-lg hover:!scale-105" />
  // );
};