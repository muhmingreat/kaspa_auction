import { AuctionDetail } from './auction-detail';

export default async function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuctionDetail id={id} />;
}
