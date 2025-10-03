import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Token {
  isNative: boolean
  address: string
  symbol: string
  decimals: number
  displayDecimals: number
}

interface TokenState {
  tokens: Token[]
}

interface TokenActions {
  addToken: (token: Token) => void
}

const initialState: TokenState = {
  tokens: [
    {
      isNative: true,
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      decimals: 18,
      displayDecimals: 4,
    },
    {
      isNative: false,
      address: '0x5F65358d61A9a281ea3BB930d05889ACa21E3f4f',
      symbol: 'USDC',
      decimals: 6,
      displayDecimals: 2,
    },
  ],
}

export const useTokensStore = create<TokenState & TokenActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      addToken: (token: Token) => set({ tokens: [...get().tokens, token] }),
    }),
    {
      name: 'tokens-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
