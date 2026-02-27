import { Ionicons } from '@expo/vector-icons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router'
import React from 'react'

const MaterialTopTabs = createMaterialTopTabNavigator()
const Tabs = withLayoutContext(MaterialTopTabs.Navigator)

export default function TabLayout() {
  return (
    <Tabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarIndicatorStyle: { height: 0 },
        tabBarActiveTintColor: '#0a84ff',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#d1d1d6',
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes_stop"
        options={{
          title: 'Routes Stop',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="bus" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="my_favorites"
        options={{
          title: 'My Favorites',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="heart" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  )
}
