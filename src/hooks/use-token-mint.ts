import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { inkSepolia } from '@wagmi/core/chains'
import { useCallback, useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import { useAccount } from 'wagmi'

import { wagmiConfig } from '@/constants/wagmi-config'

const minimalErc20MintAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export interface UseTokenMintOptions {
  onSuccess?: (txHash: `0x${string}`) => void
}

export function useTokenMint(
  tokenAddress: `0x${string}`,
  tokenDecimals: number,
  options?: UseTokenMintOptions,
) {
  const { address } = useAccount() // `chainId` (1) is wrong so need to use inkSepolia.id
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)

  const canMint = useMemo(
    () => Boolean(address && tokenAddress),
    [address, tokenAddress],
  )

  const mint = useCallback(
    async (amount: string) => {
      if (!address) throw new Error('Wallet not connected')
      if (!amount || Number(amount) <= 0)
        throw new Error('Enter a valid amount')

      setIsPending(true)
      setError(null)
      setTxHash(null)

      try {
        const value = parseUnits(amount, tokenDecimals)
        const hash = await writeContract(wagmiConfig, {
          abi: minimalErc20MintAbi,
          address: tokenAddress,
          functionName: 'mint',
          args: [address, value],
          chainId: inkSepolia.id,
        })

        setTxHash(hash)

        await waitForTransactionReceipt(wagmiConfig, {
          hash,
          chainId: inkSepolia.id,
        })

        options?.onSuccess?.(hash)

        return hash
      } catch (err) {
        console.error(err)
        setError(err as Error)
        throw err
      } finally {
        setIsPending(false)
      }
    },
    [address, options, tokenAddress, tokenDecimals],
  )

  return { mint, isPending, error, txHash, canMint }
}
