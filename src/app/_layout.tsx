import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { C } from '@/constants/theme';
import { StoreProvider, useStore } from '@/lib/store';

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { ready, t } = useStore();
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: C.bg },
        headerTintColor: C.primary,
        headerTitleStyle: { color: C.text, fontWeight: '700' },
        contentStyle: { backgroundColor: C.bg },
        headerBackTitle: '',
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="deal/[id]" options={{ title: '' }} />
      <Stack.Screen name="order/[id]" options={{ title: t('pickupCode') }} />
      <Stack.Screen name="login" options={{ title: t('login'), presentation: 'modal' }} />
      <Stack.Screen name="shop/register" options={{ title: t('becomeMerchant') }} />
      <Stack.Screen name="shop/new-bag" options={{ title: t('addBag'), presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <RootStack />
    </StoreProvider>
  );
}
