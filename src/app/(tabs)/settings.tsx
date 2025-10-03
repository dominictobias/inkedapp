import {
  AccountButton,
  AppKitButton,
  useWalletInfo,
} from '@reown/appkit-wagmi-react-native'
import { disconnect } from '@wagmi/core'
import { Button, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@/src/constants/theme'
import { wagmiConfig } from '@/src/constants/wagmi-config'

export default function SettingsScreen() {
  const { walletInfo } = useWalletInfo()

  const renderContent = () => {
    if (!walletInfo) {
      return (
        <View style={styles.centerFlex}>
          <Text style={styles.emptyWalletText}>
            Connect a wallet to get started
          </Text>
          <AppKitButton />
        </View>
      )
    }
    return (
      <View style={styles.centerFlex}>
        <AccountButton />
        <Button title="Disconnect" onPress={() => disconnect(wagmiConfig)} />
      </View>
    )
  }

  return <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  centerFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyWalletText: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
})
