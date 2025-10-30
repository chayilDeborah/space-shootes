import '../styles/globals.css';
import Head from 'next/head';
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useMemo } from 'react';

// 1. Get projectId from https://cloud.reown.com
const projectId = "c1de65ae8f0b1c52e049606aa450869e";

// 2. Set up Wagmi adapter
const networks = [base];

function MyApp({ Component, pageProps }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  const wagmiAdapter = useMemo(() => {
    return new WagmiAdapter({
      networks,
      projectId
    });
  }, []);

  // 3. Create modal
  useMemo(() => {
    createAppKit({
      adapters: [wagmiAdapter],
      networks,
      projectId,
      metadata: {
        name: 'Your App Name',
        description: 'Your App Description',
        url: 'https://yourapp.com',
        icons: ['https://yourapp.com/icon.png']
      },
      features: {
        analytics: true
      }
    });
  }, [wagmiAdapter]);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;