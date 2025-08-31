'use client'

import React, { useState } from 'react'
import { WalletContextProvider } from '@/contexts/WalletContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WalletContextProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WalletContextProvider>
  )
}
