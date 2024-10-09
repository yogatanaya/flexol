import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import default Solana wallet styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
    children: React.ReactNode; // Define the type of children
}

const WalletProviderComponent: FC<WalletProviderProps>= ({ children }) => {
    const { publicKey, connected } = useWallet();
    // Configure the network
    const network = WalletAdapterNetwork.Devnet;

    // You can add more wallet adapters here if needed
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [network]);

    return (
        <>
        
        <ConnectionProvider endpoint={clusterApiUrl(network)}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                 {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
        </>
       
    );
};

export default WalletProviderComponent;
