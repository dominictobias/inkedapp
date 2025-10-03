import { StyleSheet, Text, TextProps } from 'react-native'

import { colors } from '@/constants/theme'

export function ThemedText({ style, ...otherProps }: TextProps) {
  return <Text style={[styles.base, style]} {...otherProps} />
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
})
