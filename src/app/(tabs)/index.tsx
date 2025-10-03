import { Ionicons } from '@react-native-vector-icons/ionicons'
import {
  AccountButton,
  AppKitButton,
  useWalletInfo,
} from '@reown/appkit-wagmi-react-native'
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CurrencyIcon, FlexGroup, ThemedText } from '@/src/components'
import { colors } from '@/src/constants/theme'
import { TokenBalance, useTokenBalances } from '@/src/hooks/use-token-balances'
import { useTokensStore } from '@/src/store'
import { formatTokenBalance } from '@/src/utils/format-token-balance'

export default function HomeScreen() {
  const { walletInfo } = useWalletInfo()
  const { tokens } = useTokensStore()
  const [tokenBalances, fetchBalances] = useTokenBalances(tokens)

  const renderBalance = (item: TokenBalance) => {
    if (item.isLoading) {
      return <ActivityIndicator size="small" color={colors.text} />
    }
    if (item.error) {
      return (
        <Ionicons
          size={24}
          name="alert-circle-outline"
          color={colors.errorText}
        />
      )
    }
    return (
      <ThemedText style={styles.balanceText}>
        {formatTokenBalance(
          item.balance,
          item.token.decimals,
          item.token.displayDecimals,
        )}
      </ThemedText>
    )
  }

  const renderContent = () => {
    if (!walletInfo) {
      return (
        <FlexGroup flex={1} gap={16} flexDirection="column" alignItems="center">
          <Text style={styles.leadText}>Connect a wallet to get started</Text>
          <AppKitButton />
        </FlexGroup>
      )
    }
    return (
      <FlexGroup gap={16} flexDirection="column">
        <AccountButton />
        <FlatList
          data={tokenBalances}
          keyExtractor={item => item.token.address}
          ListEmptyComponent={
            <FlexGroup
              flex={1}
              gap={16}
              flexDirection="column"
              alignItems="center"
            >
              <Text style={styles.leadText}>No tokens found</Text>
            </FlexGroup>
          }
          renderItem={({ item }) => (
            <FlexGroup
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              style={styles.tokenItem}
            >
              <FlexGroup flexDirection="row" alignItems="center" gap={8}>
                <CurrencyIcon ccy={item.token.symbol} />
                <ThemedText style={styles.tokenSymbol}>
                  {item.token.symbol}
                </ThemedText>
              </FlexGroup>
              {renderBalance(item)}
            </FlexGroup>
          )}
        />
        <Button title="Refresh" onPress={fetchBalances} />
      </FlexGroup>
    )
  }

  return <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  leadText: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  tokenItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.raisedBg,
    borderRadius: 8,
    marginVertical: 4,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  balanceText: {
    fontSize: 16,
    color: colors.text,
  },
  loadingText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: colors.errorText,
  },
})
