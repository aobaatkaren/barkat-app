import { Tabs } from 'expo-router/js-tabs';

import { Icon } from '@/components/ui';
import { C } from '@/constants/theme';
import { useStore } from '@/lib/store';

export default function TabsLayout() {
  const { t, user } = useStore();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.border },
        headerStyle: { backgroundColor: C.bg },
        headerTitleStyle: { fontWeight: '800', color: C.text },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('discover'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="compass-outline" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('orders'),
          tabBarIcon: ({ color, size }) => <Icon name="shopping-outline" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: t('myShop'),
          href: user?.merchantId ? undefined : null,
          tabBarIcon: ({ color, size }) => <Icon name="storefront-outline" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <Icon name="account-circle-outline" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
