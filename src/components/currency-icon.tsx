import { ETH, USDC } from './currency-icons'

const iconMap = {
  ETH,
  USDC,
}

export function CurrencyIcon({ ccy }: { ccy: string }) {
  const Icon = iconMap[ccy as keyof typeof iconMap]
  if (!Icon) {
    return null
  }
  return <Icon style={{ width: 24, height: 24 }} />
}
