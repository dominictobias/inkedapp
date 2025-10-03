import type React from 'react'
import type { FlexStyle, ViewProps, ViewStyle } from 'react-native'
import { View } from 'react-native'

interface FlexGroupProps extends ViewProps {
  children: React.ReactNode
  flex?: FlexStyle['flex']
  gap?: ViewStyle['gap']
  alignItems?: FlexStyle['alignItems']
  justifyContent?: FlexStyle['justifyContent']
  flexDirection?: FlexStyle['flexDirection']
}

export function FlexGroup({
  children,
  flex,
  gap,
  alignItems,
  justifyContent,
  flexDirection,
  ...props
}: FlexGroupProps) {
  return (
    <View
      {...props}
      style={[
        props.style,
        { flex, flexDirection, alignItems, gap, justifyContent },
      ]}
    >
      {children}
    </View>
  )
}
