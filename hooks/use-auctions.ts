"use client"
import { useState, useEffect } from 'react';
import { Auction, Bid } from '@/types/auction';
import { socket, connectSocket } from '@/lib/socket';

export function useAuctions() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        connectSocket();

        socket.on('connect', () => {
            console.log('Connected to Auction Engine');
            socket.emit('request_auctions');
        });

        // If already connected, request immediately
        if (socket.connected) {
            socket.emit('request_auctions');
        }

        socket.on('all_auctions', (data: Auction[]) => {
            setAuctions(data);
            setLoading(false);
        });

        socket.on('auction_updated', (updatedAuction: Auction) => {
            setAuctions(current =>
                current.map(a => a.id === updatedAuction.id ? updatedAuction : a)
            );
        });

        socket.on('new_bid', ({ auctionId, bid }: { auctionId: string, bid: Bid }) => {
            // Opt-in update for specific auction bid list
            setAuctions(current =>
                current.map(a => {
                    if (a.id === auctionId) {
                        return {
                            ...a,
                            bids: [bid, ...a.bids],
                            bidCount: a.bidCount + 1,
                            currentPrice: bid.amount
                        };
                    }
                    return a;
                })
            );
        });

        return () => {
            socket.off('all_auctions');
            socket.off('auction_updated');
            socket.off('new_bid');
        };
    }, []);

    return { auctions, loading };
}

export function useAuction(id: string) {
    const { auctions, loading } = useAuctions();
    const auction = auctions.find(a => a.id === id);

    return { auction, loading };
}
