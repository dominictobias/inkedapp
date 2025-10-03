import { Ionicons } from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import React from 'react'

import { colors } from '@/src/constants/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cog-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="chatbox-ellipses-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
