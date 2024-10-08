import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
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

const WalletProviderComponent: FC = ({ }) => {
    // Configure the network
    const network = WalletAdapterNetwork.Devnet;

    // You can add more wallet adapters here if needed
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={clusterApiUrl(network)}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* Example Buttons */}
                    <div className="wallet-buttons mt-x-1 flex space-x-4">
                        <WalletMultiButton />
                        <WalletDisconnectButton />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletProviderComponent;
