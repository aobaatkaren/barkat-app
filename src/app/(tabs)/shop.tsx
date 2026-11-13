import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { Button, Card, Empty, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { formatPKR, timeRange } from '@/lib/i18n';
import { useStore } from '@/lib/store';

export default function Shop() {
  const { user, merchants, bags, orders, t, toggleBag, collectByCode, isRTL } = useStore();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const merchant = merchants.find((m) => m.id === user?.merchantId);
  if (!merchant) return <Redirect href="/profile" />;

  const myBags = bags.filter((b) => b.merchantId === merchant.id);
  const myOrders = orders.filter((o) => o.merchantId === merchant.id && o.status !== 'cancelled');
  const row = isRTL ? 'row-reverse' : 'row';

  const verify = () => {
    const o = collectByCode(code);
    setMsg(o ? { ok: true, text: `${t('collectedOk')} ${formatPKR(o.total)} — ${o.customerName}` } : { ok: false, text: t('codeNotFound') });
    if (o) setCode('');
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <T style={s.h1}>{merchant.name}</T>
      <T style={s.muted}>
        {merchant.area}, {merchant.city}
      </T>

      <Card>
        <T style={s.h2}>{t('verifyCode')}</T>
        <TextInput
          value={code}
          onChangeText={(v) => (setCode(v.toUpperCase()), setMsg(null))}
          autoCapitalize="characters"
          maxLength={5}
          placeholder="ABC12"
          placeholderTextColor={C.muted}
          style={[s.input, { letterSpacing: 4, fontWeight: '700', textAlign: 'center', fontSize: 20 }]}
        />
        <Button title={t('markCollected')} icon="check" onPress={verify} disabled={code.length !== 5} />
        {msg && <T style={{ color: msg.ok ? C.primary : C.danger, fontWeight: '600' }}>{msg.text}</T>}
      </Card>

      <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center' }}>
        <T style={s.h2}>{t('yourBags')}</T>
        <Button title={t('addBag')} icon="plus" variant="outline" onPress={() => router.push('/shop/new-bag')} style={{ paddingVertical: 8 }} />
      </View>
      {myBags.length === 0 && <Empty icon="shopping-outline" text={t('noBags')} />}
      {myBags.map((b) => (
        <Card key={b.id} style={!b.active ? { opacity: 0.6 } : undefined}>
          <View style={{ flexDirection: row, justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <T style={{ fontWeight: '700', fontSize: 16 }}>{b.title}</T>
              <T style={s.muted}>
                {formatPKR(b.price)} · {b.quantityLeft} {t('left')} · {timeRange(b.pickupStart, b.pickupEnd)}
              </T>
            </View>
            <Button title={b.active ? t('hide') : t('show')} variant="outline" onPress={() => toggleBag(b.id)} style={{ paddingVertical: 6 }} />
          </View>
        </Card>
      ))}

      <T style={s.h2}>{t('reservations')}</T>
      {myOrders.length === 0 && <Empty icon="clipboard-text-outline" text={t('noReservations')} />}
      {myOrders.map((o) => (
        <Card key={o.id}>
          <View style={{ flexDirection: row, justifyContent: 'space-between' }}>
            <T style={{ fontWeight: '700' }}>
              {o.customerName} · {o.customerPhone}
            </T>
            <Text style={{ color: o.status === 'reserved' ? C.primary : C.muted, fontWeight: '700' }}>{t(`status_${o.status}`)}</Text>
          </View>
          <T style={s.muted}>
            {bags.find((b) => b.id === o.bagId)?.title} × {o.quantity} · {formatPKR(o.total)}
          </T>
        </Card>
      ))}
    </ScrollView>
  );
}
