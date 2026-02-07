import Link from 'next/link'
import { Github, FileText, Twitter, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

const footerLinks = {
  product: [
    { label: 'Auctions', href: '/' },
    { label: 'Create Listing', href: '/create' },
    { label: 'My Bids', href: '/my-bids' },
  ],
  resources: [
    { label: 'Documentation', href: '/documentation', icon: FileText },
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'API Reference', href: 'https://api.kaspa.org/docs' },
  ],
  community: [
    { label: 'Twitter', href: 'https://twitter.com/KaspaCurrency', icon: Twitter },
    { label: 'Discord', href: 'https://discord.gg/kaspa', icon: MessageCircle },
    { label: 'Forum', href: 'https://reddit.com/r/kaspa' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-lg font-bold text-foreground">Kaspa Auction</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Real-time auctions powered by the Kaspa blockchain.
              Lightning-fast bids that confirm in milliseconds.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Community</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kaspa Auction. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
