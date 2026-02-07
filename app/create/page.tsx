import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CreateAuctionForm } from '@/components/create/create-auction-form'

export const metadata = {
  title: 'Create Auction | Kaspa Auction',
  description: 'List your item for auction on the Kaspa blockchain.',
}

export default function CreateAuctionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create Auction</h1>
            <p className="mt-2 text-muted-foreground">
              List your item and start receiving bids instantly
            </p>
          </div>
          
          <CreateAuctionForm />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
