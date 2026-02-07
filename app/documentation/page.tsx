import { FileText } from 'lucide-react'

export default function DocumentationPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground">
                    Welcome to the Kaspa Auction Engine documentation. This section will be updated with guides, tutorials, and reference materials.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
                        <p className="text-muted-foreground mb-4">Learn how to create your first auction and place bids.</p>
                        <span className="text-sm font-medium text-primary">Coming Soon &rarr;</span>
                    </div>

                    <div className="rounded-lg border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Seller Guidelines</h2>
                        <p className="text-muted-foreground mb-4">Best practices for listing items and managing your auctions.</p>
                        <span className="text-sm font-medium text-primary">Coming Soon &rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
