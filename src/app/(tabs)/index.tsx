import { Ionicons } from '@react-native-vector-icons/ionicons'
import {
  AccountButton,
  AppKitButton,
  useWalletInfo,
} from '@reown/appkit-wagmi-react-native'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CurrencyIcon, FlexGroup, ThemedText } from '@/components'
import { colors } from '@/constants/theme'
import { TokenBalance, useTokenBalances } from '@/hooks/use-token-balances'
import { useTokenMint } from '@/hooks/use-token-mint'
import { useTokensStore } from '@/store'
import { formatTokenBalance } from '@/utils/format-token-balance'

export default function HomeScreen() {
  const { walletInfo } = useWalletInfo()
  const { tokens } = useTokensStore()
  const [tokenBalances, fetchBalances] = useTokenBalances(tokens)
  const usdc = tokens.find(t => t.symbol === 'USDC')
  const { mint, isPending, error } = useTokenMint(
    usdc?.address as `0x${string}`,
    usdc?.decimals ?? 6,
    {
      onSuccess: () => {
        // Delay it to give the blockchain a chance
        setTimeout(() => {
          fetchBalances()
        }, 1000)
      },
    },
  )
  const [amount, setAmount] = useState('')

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
        <FlexGroup
          flex={1}
          gap={16}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
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
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
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
        <FlexGroup gap={8} flexDirection="column" style={styles.mintSection}>
          <ThemedText style={styles.mintTitle}>Mint USDC</ThemedText>
          <FlexGroup gap={8} flexDirection="row" alignItems="center">
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor={colors.secondaryText}
              keyboardType="numeric"
              style={styles.amountInput}
            />
            <Button
              title={isPending ? 'Minting...' : 'Mint'}
              onPress={async () => {
                try {
                  await mint(amount)
                  setAmount('')
                } catch {}
              }}
              disabled={isPending || !amount}
            />
          </FlexGroup>
          {error ? (
            <Text style={styles.errorText}>{String(error.message)}</Text>
          ) : null}
        </FlexGroup>
      </FlexGroup>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
    </TouchableWithoutFeedback>
  )
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
  mintSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
  },
  mintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: colors.text,
  },
})
