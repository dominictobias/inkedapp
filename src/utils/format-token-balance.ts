export function formatTokenBalance(
  balance: bigint,
  decimals: number,
  displayDecimals: number,
): string {
  // Convert bigint to number for formatting
  const divisor = BigInt(10 ** decimals)
  const quotient = balance / divisor
  const remainder = balance % divisor

  // Calculate the decimal part as a fraction
  const decimalValue = Number(remainder) / Number(divisor)
  const fullValue = Number(quotient) + decimalValue

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  })

  return formatter.format(fullValue)
}
