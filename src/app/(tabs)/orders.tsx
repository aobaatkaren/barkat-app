import { Link, router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { Button, Card, Empty, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { formatPKR } from '@/lib/i18n';
import { useStore } from '@/lib/store';

const STATUS_COLOR = { reserved: C.primary, collected: C.muted, cancelled: C.danger } as const;

export default function Orders() {
  const { orders, bags, merchants, user, t, isRTL } = useStore();

  if (!user) {
    return (
      <View style={[s.screen, s.content]}>
        <Empty icon="account-lock-outline" text={t('noOrders')} />
        <Button title={t('login')} onPress={() => router.push('/login')} />
      </View>
    );
  }

  const mine = orders.filter((o) => o.customerPhone === user.phone);
  const row = isRTL ? 'row-reverse' : 'row';

  return (
    <FlatList
      style={s.screen}
      contentContainerStyle={s.content}
      data={mine}
      keyExtractor={(o) => o.id}
      ListEmptyComponent={<Empty icon="shopping-outline" text={t('noOrders')} />}
      renderItem={({ item: o }) => {
        const bag = bags.find((b) => b.id === o.bagId);
        const m = merchants.find((x) => x.id === o.merchantId);
        return (
          <Link href={{ pathname: '/order/[id]', params: { id: o.id } }} asChild>
            <Pressable>
              <Card>
                <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
                  <T style={{ fontWeight: '700', fontSize: 16, flex: 1 }}>{m?.name}</T>
                  <Text style={{ color: STATUS_COLOR[o.status], fontWeight: '700' }}>{t(`status_${o.status}`)}</Text>
                </View>
                <T style={s.muted}>
                  {bag?.title} × {o.quantity} · {formatPKR(o.total)}
                </T>
                {o.status === 'reserved' && (
                  <T style={{ fontWeight: '800', letterSpacing: 3, color: C.primary }}>
                    {t('pickupCode')}: {o.pickupCode}
                  </T>
                )}
              </Card>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}
