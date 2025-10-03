import { getBalance } from '@wagmi/core'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { wagmiConfig } from '@/constants/wagmi-config'
import { type Token } from '@/store'

export interface TokenBalance {
  token: Token
  balance: bigint
  isLoading: boolean
  error: Error | null
}

export function useTokenBalances(
  tokens: Token[],
): [TokenBalance[], () => Promise<void>] {
  const { address } = useAccount()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const balancePromises = tokens.map(async token => {
        try {
          const balance = await getBalance(wagmiConfig, {
            address,
            token: token.isNative
              ? undefined
              : (token.address as `0x${string}`),
          })

          return {
            token,
            balance: balance.value,
            isLoading: false,
            error: null,
          }
        } catch (err) {
          return {
            token,
            balance: 0n,
            isLoading: false,
            error: err as Error,
          }
        }
      })

      const results = await Promise.all(balancePromises)
      setBalances(results)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [address, tokens])

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  const balancesWithState = balances.map(balance => ({
    ...balance,
    isLoading,
    error: error || balance.error,
  }))

  return [balancesWithState, fetchBalances]
}
