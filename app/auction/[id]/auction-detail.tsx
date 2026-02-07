'use client';

import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuction } from '@/hooks/use-auctions';
import { AuctionDetailsView } from '@/components/auction/auction-details-view';

interface AuctionDetailProps {
    id: string;
}

export function AuctionDetail({ id }: AuctionDetailProps) {
    const { auction, loading } = useAuction(id);

    // While loading, show a skeleton or loading state
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto p-4 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading auction...</p>
                </main>
                <Footer />
            </div>
        );
    }

    // If done loading and no auction, 404
    if (!auction) {
        notFound();
    }

    // Render the rich view
    // AuctionDetailsView handles all the UI for bidding, images, history etc.
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <AuctionDetailsView auction={auction} />
            </main>
            <Footer />
        </div>
    );
}
