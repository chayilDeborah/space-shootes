import '../styles/globals.css';
import Head from 'next/head';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Base } from "@thirdweb-dev/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider 
        activeChain={Base}
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      >
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
