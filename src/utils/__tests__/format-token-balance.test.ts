import { formatTokenBalance } from '../format-token-balance'
import { expect, test } from 'vitest'

test('formats basic token balance with 18 decimals', () => {
  // 1.5 ETH (1.5 * 10^18)
  const balance = BigInt('1500000000000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('1.5')
})

test('formats large token balance', () => {
  // 1,000,000 ETH (1,000,000 * 10^18)
  const balance = BigInt('1000000000000000000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('1,000,000')
})

test('formats zero balance', () => {
  const balance = BigInt('0')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('0')
})

test('formats balance with different decimal places', () => {
  // 123.456789 ETH (123.456789 * 10^18)
  const balance = BigInt('123456789000000000000')
  const result = formatTokenBalance(balance, 18, 6)
  expect(result).toBe('123.456789')
})

test('truncates to specified display decimals', () => {
  // 1.23456789 ETH (1.23456789 * 10^18)
  const balance = BigInt('1234567890000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('1.23')
})

test('handles USDC with 6 decimals', () => {
  // 1,000.50 USDC (1,000.50 * 10^6)
  const balance = BigInt('1000500000')
  const result = formatTokenBalance(balance, 6, 2)
  expect(result).toBe('1,000.5')
})

test('handles token with 0 decimals', () => {
  // 123 tokens with 0 decimals
  const balance = BigInt('123')
  const result = formatTokenBalance(balance, 0, 2)
  expect(result).toBe('123')
})

test('handles very small amounts', () => {
  // 0.000001 ETH (1 * 10^12 wei)
  const balance = BigInt('1000000000000')
  const result = formatTokenBalance(balance, 18, 6)
  expect(result).toBe('0.000001')
})

test('rounds down when truncating', () => {
  // 1.999999 ETH (1.999999 * 10^18)
  const balance = BigInt('1999999000000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('2')
})

test('handles maximum display decimals', () => {
  // 1.123456789012345678 ETH
  const balance = BigInt('1123456789012345678')
  const result = formatTokenBalance(balance, 18, 18)
  expect(result).toBe('1.1234567890123457')
})

test('handles minimum display decimals (0)', () => {
  // 1.9 ETH (1.9 * 10^18)
  const balance = BigInt('1900000000000000000')
  const result = formatTokenBalance(balance, 18, 0)
  expect(result).toBe('2')
})

test('handles very large numbers with commas', () => {
  // 1,234,567.89 ETH (1,234,567.89 * 10^18)
  const balance = BigInt('1234567890000000000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('1,234,567.89')
})

test('handles edge case with remainder exactly at divisor', () => {
  // 2.0 ETH (2 * 10^18)
  const balance = BigInt('2000000000000000000')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('2')
})

test('handles precision with different token decimals', () => {
  // 1.2345 tokens with 4 decimals
  const balance = BigInt('12345')
  const result = formatTokenBalance(balance, 4, 2)
  expect(result).toBe('1.23')
})

test('handles very large remainder that needs precision', () => {
  // 1.999999999999999999 ETH (just under 2)
  const balance = BigInt('1999999999999999999')
  const result = formatTokenBalance(balance, 18, 2)
  expect(result).toBe('2')
})
