import { memo } from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

export const ETH = memo((props: SvgProps) => {
  return (
    <Svg
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 784.37 1277.39"
      {...props}
    >
      <G fillRule="nonzero">
        <Path
          fill="#343434"
          d="M392.07 0L383.5 29.11 383.5 873.74 392.07 882.29 784.13 650.54z"
        />
        <Path
          fill="#8C8C8C"
          d="M392.07 0L0 650.54 392.07 882.29 392.07 472.33z"
        />
        <Path
          fill="#3C3C3B"
          d="M392.07 956.52L387.24 962.41 387.24 1263.28 392.07 1277.38 784.37 724.89z"
        />
        <Path fill="#8C8C8C" d="M392.07 1277.38L392.07 956.52 0 724.89z" />
        <Path fill="#141414" d="M392.07 882.29L784.13 650.54 392.07 472.33z" />
        <Path fill="#393939" d="M0 650.54L392.07 882.29 392.07 472.33z" />
      </G>
    </Svg>
  )
})

ETH.displayName = 'ETH'
