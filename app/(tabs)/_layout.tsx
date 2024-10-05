import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '../../components';
import { useSession } from '../ctx';
import { Text, useTheme } from 'react-native-paper';

export default function TabLayout() {
const { session, isLoading } = useSession();
const theme = useTheme();

if(isLoading) {
  return <Text>Tô carregando ainda...</Text>
}

if(!session) {
  return <Redirect href="/login" />
}

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarStyle: {
            backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fraldas"
        options={{
          title: 'Fraldas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code' : 'code'} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="profile"
        //@ts-ignore
        params={{ user: session }}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
