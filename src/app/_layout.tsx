// sort-imports-ignore
import '@walletconnect/react-native-compat'
import 'react-native-reanimated'

import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { AppKit, createAppKit } from '@reown/appkit-wagmi-react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { inkSepolia } from '@wagmi/core/chains'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { WagmiProvider } from 'wagmi'

import { metadata, projectId, wagmiConfig } from '@/src/constants/wagmi-config'

const queryClient = new QueryClient()

createAppKit({
  projectId,
  metadata,
  wagmiConfig,
  defaultChain: inkSepolia,
})

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider value={DarkTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
