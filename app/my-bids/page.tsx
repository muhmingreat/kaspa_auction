import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MyBidsView } from '@/components/my-bids/my-bids-view'

export const metadata = {
  title: 'My Bids | Kaspa Auction',
  description: 'Track your auction bids and activity.',
}

export default function MyBidsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Bids</h1>
            <p className="mt-2 text-muted-foreground">
              Track your bidding activity and auction history
            </p>
          </div>
          
          <MyBidsView />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
