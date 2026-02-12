'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface WalletState {
    connected: boolean
    address?: string
    balance?: number
    name?: string
    allAccounts?: string[]
}

interface WalletContextType extends WalletState {
    connect: () => Promise<void>
    disconnect: () => void
    refreshBalance: () => Promise<void>
    isConnecting: boolean
    error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<WalletState>({ connected: false })
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateWalletInfo = useCallback(async (address: string) => {
        try {
            if (!window.kasware) return

            const [balanceObj, allAccounts] = await Promise.all([
                window.kasware.getBalance(),
                window.kasware.getAccounts()
            ])

            setWallet({
                connected: true,
                address,
                allAccounts: allAccounts || [address],
                balance: (balanceObj?.total || 0) / 1e8,
                name: 'KasWare Wallet'
            })
        } catch (err) {
            console.error('Failed to update wallet info:', err)
            setError('Failed to fetch balance')
        }
    }, [])

    const refreshBalance = useCallback(async () => {
        if (wallet.connected && wallet.address) {
            await updateWalletInfo(wallet.address)
        }
    }, [wallet.connected, wallet.address, updateWalletInfo])

    const checkConnection = useCallback(async () => {
        if (typeof window.kasware !== 'undefined') {
            try {
                const accounts = await window.kasware.getAccounts()
                if (accounts && accounts.length > 0) {
                    updateWalletInfo(accounts[0])
                }

                window.kasware.on('accountsChanged', (accounts: string[]) => {
                    if (accounts && accounts.length > 0) {
                        updateWalletInfo(accounts[0])
                    } else {
                        setWallet({ connected: false })
                    }
                })

                window.kasware.on('networkChanged', () => {
                    window.location.reload()
                })
            } catch (err) {
                console.warn('Initial connection check failed:', err)
            }
        }
    }, [updateWalletInfo])

    useEffect(() => {
        checkConnection()
    }, [checkConnection])

    const connect = async () => {
        setError(null)
        setIsConnecting(true)
        try {
            if (!window.kasware) {
                throw new Error('KasWare Wallet not detected')
            }
            const accounts = await window.kasware.requestAccounts()
            if (accounts && accounts.length > 0) {
                await updateWalletInfo(accounts[0])
            }
        } catch (err: any) {
            setError(err.message || 'Failed to connect')
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnect = () => {
        setWallet({ connected: false })
    }

    return (
        <WalletContext.Provider value={{ ...wallet, connect, disconnect, refreshBalance, isConnecting, error }}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}
