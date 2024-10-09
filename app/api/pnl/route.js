import { NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection(process.env.SOLANA_RPC_URL);

export async function POST(request) {
    const { ownerAccount, tokenMint } = await request.json();

    try {
        // Convert to PublicKey instances
        const walletAddress = new PublicKey(ownerAccount);
        const myToken = new PublicKey(tokenMint);

        const pnlPercentage = await calculatePumpFunProfit(walletAddress, myToken);

        return NextResponse.json({ pnlPercentage });
    } catch (error) {
        console.error('Error calculating profit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function calculatePumpFunProfit(walletAddress, myToken) {
    let solNetProfit = 0;
    let lastTxn = undefined;

    // Get initial SOL balance before any token-related transactions
    const initialSOLBalance = await connection.getBalance(walletAddress) / LAMPORTS_PER_SOL;

    // Fetch transaction signatures for the given wallet address
    const sigs = await connection.getSignaturesForAddress(walletAddress, { limit: 500, before: lastTxn });
    lastTxn = sigs[sigs.length - 1]?.signature;

    // Chunk signatures for efficient processing
    const sigsChunked = [];
    for (let i = 0; i < sigs.length; i++) {
        const chunkIndex = Math.trunc(i / 100);
        if (!sigsChunked[chunkIndex]) sigsChunked[chunkIndex] = [];
        sigsChunked[chunkIndex].push(sigs[i].signature);
    }

    // Process each chunk of signatures
    for (const chunk of sigsChunked) {
        let chunkHasToken = false;
        let res = null;

        do {
            // Fetch transaction data from Helius API
            res = await fetch("https://api.helius.xyz/v0/transactions?api-key=" + process.env.HELIUS_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactions: chunk }),
            });
        } while (!res?.ok);

        const txnArr = await res.json();

        // Process each transaction in the chunk
        for (const txn of txnArr) {
            if (txn.transactionError) continue;
            const containsToken = txn.accountData.some(ad =>
                ad.tokenBalanceChanges.some(tbc => tbc.mint == myToken.toString())
            );
            if (!containsToken) continue;

            const accountData = txn.accountData.find(ad => ad.account == walletAddress.toString());
            if (!accountData) continue;

            chunkHasToken = true;
            solNetProfit += accountData.nativeBalanceChange / LAMPORTS_PER_SOL; // Convert to SOL
        }

        // If no more token-related transactions and profit is non-zero, return the net profit
        if (!chunkHasToken && solNetProfit != 0) {
            return calculatePnLPercentage(initialSOLBalance, solNetProfit); // Return PnL percentage
        }
    }

    return calculatePnLPercentage(initialSOLBalance, solNetProfit); // Return final PnL percentage
}

// Helper function to calculate PnL in percentage
function calculatePnLPercentage(initialBalance, netProfit) {
    if (initialBalance === 0) return 0; // Avoid division by zero
    const pnlPercentage = (netProfit / initialBalance) * 100;
    return pnlPercentage.toFixed(1);
}
