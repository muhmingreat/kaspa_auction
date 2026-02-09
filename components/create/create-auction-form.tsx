'use client'

import React from "react"

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  Clock,
  Gavel,
  Info,
  AlertCircle,
  Loader2,
  Check,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AuctionCardPreview } from '@/components/create/auction-card-preview'
import { formatKAS } from '@/lib/mock-data'
import { apiPost } from '@/lib/api'

const durationOptions = [
  { label: '1 Hour', value: 1 },
  { label: '6 Hours', value: 6 },
  { label: '12 Hours', value: 12 },
  { label: '24 Hours', value: 24 },
  { label: '3 Days', value: 72 },
  { label: '7 Days', value: 168 },
]

const categoryOptions = [
  'Hardware',
  'NFT',
  'Digital',
  'Collectibles',
  'Services',
  'Other',
]

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function CreateAuctionForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Real wallet connection state for seller address
  const [walletInfo, setWalletInfo] = useState<{ address?: string }>({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startPrice: '',
    reservePrice: '',
    receivingAddress: '', // New field
    duration: 24,
    category: 'Hardware',
  })
  const [createdAuctionId, setCreatedAuctionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      if (typeof window.kasware !== 'undefined') {
        console.log('[CreateAuctionForm] KasWare detected, checking accounts...');
        try {
          const accounts = await window.kasware.getAccounts()
          if (accounts && accounts.length > 0) {
            console.log('[CreateAuctionForm] Found accounts:', accounts);
            setWalletInfo({ address: accounts[0] })
            setFormData(prev => ({ ...prev, receivingAddress: prev.receivingAddress || accounts[0] }))
          }
        } catch (err) {
          console.error('[CreateAuctionForm] Error fetching accounts:', err);
        }

        window.kasware.on('accountsChanged', (accounts: string[]) => {
          console.log('[CreateAuctionForm] Accounts changed:', accounts);
          if (accounts && accounts.length > 0) {
            setWalletInfo({ address: accounts[0] })
            setFormData(prev => ({ ...prev, receivingAddress: prev.receivingAddress || accounts[0] }))
          } else {
            setWalletInfo({})
          }
        })
      }
    }
    fetchWallet()

    // Check every second for detection if not found initially
    const interval = setInterval(() => {
      if (typeof window.kasware !== 'undefined') {
        fetchWallet();
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (window.kasware) {
        window.kasware.removeAllListeners?.('accountsChanged');
      }
    };
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeImage = useCallback(() => {
    setImagePreview(null)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleDurationSelect = (value: number) => {
    setFormData((prev) => ({ ...prev, duration: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.startPrice || Number(formData.startPrice) <= 0) {
      newErrors.startPrice = 'Valid starting price is required'
    }
    // Validate receiving address using walletInfo if available
    const addressToValidate = walletInfo.address || formData.receivingAddress;
    // Validate receiving address using connected wallet
    if (!walletInfo.address) {
      newErrors.receivingAddress = 'Wallet not connected';
    } else {
      // Normalize address to include "kaspa:" prefix if missing
      const normalized = walletInfo.address.startsWith('kaspa:')
        ? walletInfo.address
        : `kaspa:${walletInfo.address}`;
      // Optionally update formData for consistency (not required for submission)
      setFormData((prev) => ({ ...prev, receivingAddress: normalized }));
    }
    if (!imagePreview) {
      newErrors.image = 'Please upload an image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setFormState('submitting')

    try {
      console.log('[CreateAuctionForm] Submitting auction to API...');
      const data = await apiPost('/api/auctions', {
        ...formData,
        imageUrl: imagePreview, // include base64 image data
        sellerAddress: walletInfo.address || formData.receivingAddress, // Use connected wallet as seller
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + formData.duration * 3600000).toISOString(),
      });

      if (data.auction && data.auction.id) {
        setCreatedAuctionId(data.auction.id);
      }

      setFormState('success')
    } catch (err) {
      console.error(err)
      setFormState('error')
      setErrors(prev => ({ ...prev, submit: 'Failed to connect to auction engine.' }))
    }
  }


  if (formState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground">Auction Created!</h2>
        <p className="mt-2 text-muted-foreground">
          Your auction is now live and ready to receive bids.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => {
              setFormState('idle')
              setFormData({
                title: '',
                description: '',
                startPrice: '',
                reservePrice: '',
                receivingAddress: walletInfo.address || '',
                duration: 24,
                category: 'Hardware',
              })
              setImagePreview(null)
            }}
            variant="outline"
          >
            Create Another
          </Button>
          <Button className="bg-[#4F46E5] hover:bg-[#4338CA]" asChild>
            <a href={createdAuctionId ? `/auction/${createdAuctionId}` : '/explore'}>
              View Your Auction
            </a>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Item Image</CardTitle>
            <CardDescription>Upload a high-quality image of your item</CardDescription>
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-xl border border-border">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className={cn(
                  'flex flex-col items-center justify-center aspect-video w-full cursor-pointer rounded-xl border-2 border-dashed transition-colors',
                  errors.image
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-border hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/5'
                )}
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.image}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Item Details</CardTitle>
            <CardDescription>Provide information about your item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Rare Kaspa Miner #001"
                value={formData.title}
                onChange={handleInputChange}
                className={cn(errors.title && 'border-red-500')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your item in detail..."
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={cn(errors.description && 'border-red-500')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
            <CardDescription>Set your auction pricing in KAS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startPrice">Starting Price (KAS)</Label>
              <div className="relative">
                <Gavel className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="startPrice"
                  name="startPrice"
                  type="number"
                  placeholder="0"
                  value={formData.startPrice}
                  onChange={handleInputChange}
                  className={cn('pl-10', errors.startPrice && 'border-red-500')}
                  min="0"
                  step="1"
                />
              </div>
              {errors.startPrice && (
                <p className="mt-1 text-sm text-red-500">{errors.startPrice}</p>
              )}
            </div>

            <div>
              <Label htmlFor="reservePrice">
                Reserve Price (Optional)
                <span className="ml-1 text-muted-foreground font-normal">- Hidden minimum</span>
              </Label>
              <div className="relative">
                <Gavel className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reservePrice"
                  name="reservePrice"
                  type="number"
                  placeholder="0"
                  value={formData.reservePrice}
                  onChange={handleInputChange}
                  className="pl-10"
                  min="0"
                  step="1"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                If set, auction won&#39;t complete below this price
              </p>
            </div>

            {/* <div className="pt-4 border-t border-border">
    // Receiving address is now auto‑filled from the connected KasWare wallet. The input field has been removed for a cleaner UI.

            </div> */}
          </CardContent>
        </Card>

        {/* Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Duration</CardTitle>
            <CardDescription>How long should your auction run?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleDurationSelect(option.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                    formData.duration === option.value
                      ? 'border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5]'
                      : 'border-border hover:border-[#4F46E5]/30 hover:bg-[#4F46E5]/5'
                  )}
                >
                  <Clock className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-kaspa hover:shadow-kaspa-lg"
        >
          {formState === 'submitting' ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Auction...
            </>
          ) : (
            <>
              <Gavel className="mr-2 h-5 w-5" />
              Create Auction
            </>
          )}
        </Button>
      </form>

      {/* Live Preview */}
      <div className="block lg:block">
        <div className="sticky top-24">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Live Preview</h3>
          <AuctionCardPreview
            title={formData.title || 'Your Item Title'}
            imageUrl={imagePreview || '/placeholder.svg?height=400&width=400'}
            startPrice={Number(formData.startPrice) || 0}
            duration={formData.duration}
            category={formData.category}
          />

          {/* Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-medium">1</span>
                Use high-quality, well-lit photos
              </p>
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-medium">2</span>
                Write detailed, honest descriptions
              </p>
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-medium">3</span>
                Set a competitive starting price
              </p>
              <p className="flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-medium">4</span>
                Choose an appropriate duration
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
