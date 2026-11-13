import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { formatPKR, timeRange } from '@/lib/i18n';
import { useStore } from '@/lib/store';

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, bags, merchants, t, cancelOrder } = useStore();
  const order = orders.find((o) => o.id === id);
  const bag = bags.find((b) => b.id === order?.bagId);
  const merchant = merchants.find((m) => m.id === order?.merchantId);
  if (!order || !bag || !merchant) return null;

  const active = order.status === 'reserved';

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View style={[st.codeBox, !active && { backgroundColor: C.muted }]}>
        <Text style={st.codeLabel}>{t(`status_${order.status}`)}</Text>
        <Text style={st.code}>{order.pickupCode}</Text>
        <Text style={st.codeHint}>{t('showCode')}</Text>
      </View>

      <Card>
        <T style={s.h2}>{merchant.name}</T>
        <T style={s.muted}>
          {merchant.address}, {merchant.area}, {merchant.city}
        </T>
        <T>
          {t('pickup')} {t('today')} {timeRange(bag.pickupStart, bag.pickupEnd)}
        </T>
      </Card>

      <Card>
        <T style={{ fontWeight: '600' }}>
          {bag.title} × {order.quantity}
        </T>
        <T style={{ fontSize: 20, fontWeight: '800' }}>
          {t('total')}: {formatPKR(order.total)}
        </T>
        <T style={s.muted}>{t('payAtPickup')}</T>
      </Card>

      {active && (
        <Button
          title={t('cancelOrder')}
          variant="danger"
          onPress={() => {
            cancelOrder(order.id);
            router.back();
          }}
        />
      )}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  codeBox: { backgroundColor: C.primary, borderRadius: 22, padding: 24, alignItems: 'center', gap: 8 },
  codeLabel: { color: '#DDF0E5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  code: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: 8 },
  codeHint: { color: '#DDF0E5', textAlign: 'center' },
});
