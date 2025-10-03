import { defaultWagmiConfig } from '@reown/appkit-wagmi-react-native'
import { inkSepolia } from 'viem/chains'

export const projectId = 'ff1484fd14faa2b9ca9252ccfea3c6d1'

export const metadata = {
  name: 'InkDApp connect',
  description: 'Wallet connection for InkDApp',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'inkdapp://',
    universal: 'inkdapp.com',
  },
}

const chains = [inkSepolia] as const

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
