import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Icon, s, T, type IconName } from '@/components/ui';
import { C } from '@/constants/theme';
import { CATEGORY_ICON, CATEGORY_LABEL, formatPKR, timeRange } from '@/lib/i18n';
import { useStore } from '@/lib/store';

export default function Deal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bags, merchants, t, lang, user, reserve, isRTL } = useStore();
  const [qty, setQty] = useState(1);

  const bag = bags.find((b) => b.id === id);
  const merchant = merchants.find((m) => m.id === bag?.merchantId);
  if (!bag || !merchant) return null;

  const max = Math.min(bag.quantityLeft, 3);
  const row = isRTL ? 'row-reverse' : 'row';

  const onReserve = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const order = reserve(bag.id, qty);
    router.replace({ pathname: '/order/[id]', params: { id: order.id } });
  };

  return (
    <>
      <Stack.Screen options={{ title: merchant.name }} />
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <View style={st.hero}>
          <Icon name={CATEGORY_ICON[merchant.category] as IconName} size={56} color={C.primary} />
        </View>

        <T style={s.h1}>{bag.title}</T>
        <T style={s.muted}>
          {merchant.name} · {CATEGORY_LABEL[lang][merchant.category]}
        </T>

        <Card>
          <InfoRow icon="clock-outline" text={`${t('pickup')} ${t('today')} ${timeRange(bag.pickupStart, bag.pickupEnd)}`} row={row} />
          <InfoRow icon="map-marker-outline" text={`${merchant.address}, ${merchant.area}, ${merchant.city}`} row={row} />
          <InfoRow icon="cash" text={t('payAtPickup')} row={row} />
        </Card>

        <Card>
          <T style={s.h2}>{t('whatsInside')}</T>
          <T style={{ lineHeight: 22 }}>{bag.description}</T>
          <T style={[s.muted, { fontSize: 13 }]}>{t('surpriseNote')}</T>
        </Card>

        <Card>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
            <T style={{ fontWeight: '600' }}>{t('quantity')}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Step icon="minus" onPress={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} />
              <Text style={{ fontSize: 18, fontWeight: '700', minWidth: 20, textAlign: 'center' }}>{qty}</Text>
              <Step icon="plus" onPress={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} />
            </View>
          </View>
          <View style={{ flexDirection: row, justifyContent: 'space-between' }}>
            <T style={s.muted}>{t('youSave')}</T>
            <Text style={{ color: C.primary, fontWeight: '700' }}>{formatPKR((bag.originalPrice - bag.price) * qty)}</Text>
          </View>
          <View style={{ flexDirection: row, justifyContent: 'space-between' }}>
            <T style={{ fontWeight: '700', fontSize: 17 }}>{t('total')}</T>
            <Text style={{ fontWeight: '800', fontSize: 20 }}>{formatPKR(bag.price * qty)}</Text>
          </View>
        </Card>

        <Button
          title={bag.quantityLeft > 0 ? t('confirmReserve') : t('soldOut')}
          icon="check-circle-outline"
          disabled={bag.quantityLeft <= 0}
          onPress={onReserve}
        />
      </ScrollView>
    </>
  );
}

function InfoRow({ icon, text, row }: { icon: IconName; text: string; row: 'row' | 'row-reverse' }) {
  return (
    <View style={{ flexDirection: row, gap: 10, alignItems: 'center' }}>
      <Icon name={icon} size={20} color={C.primary} />
      <T style={{ flex: 1 }}>{text}</T>
    </View>
  );
}

function Step({ icon, onPress, disabled }: { icon: IconName; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[st.step, disabled && { opacity: 0.35 }]}>
      <Icon name={icon} size={18} color={C.primary} />
    </Pressable>
  );
}

const st = StyleSheet.create({
  hero: { height: 150, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  step: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
});
