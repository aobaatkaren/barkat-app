import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Field, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { useStore } from '@/lib/store';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function NewBag() {
  const { t, saveBag } = useStore();
  const [f, setF] = useState({ title: '', description: '', originalPrice: '', price: '', quantity: '5', start: '20:00', end: '22:00' });
  const [error, setError] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  const submit = () => {
    const orig = Number(f.originalPrice);
    const price = Number(f.price);
    const qty = Number(f.quantity);
    const ok =
      f.title.trim() && f.description.trim() && orig > 0 && price > 0 && price < orig &&
      Number.isInteger(qty) && qty > 0 && TIME.test(f.start) && TIME.test(f.end);
    if (!ok) return setError(true);
    saveBag({
      title: f.title.trim(),
      description: f.description.trim(),
      originalPrice: orig,
      price,
      quantityLeft: qty,
      pickupStart: f.start,
      pickupEnd: f.end,
    });
    router.back();
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Field label={t('title')} value={f.title} onChangeText={set('title')} placeholder="Bread & Pastry Bag" />
      <Field label={t('description')} value={f.description} onChangeText={set('description')} multiline />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label={t('originalPrice')} value={f.originalPrice} onChangeText={set('originalPrice')} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label={t('price')} value={f.price} onChangeText={set('price')} keyboardType="number-pad" />
        </View>
      </View>
      <Field label={t('quantity')} value={f.quantity} onChangeText={set('quantity')} keyboardType="number-pad" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label={t('pickupFrom')} value={f.start} onChangeText={set('start')} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label={t('pickupTo')} value={f.end} onChangeText={set('end')} />
        </View>
      </View>
      {error && <T style={{ color: C.danger }}>{t('required')}</T>}
      <Button title={t('save')} onPress={submit} />
    </ScrollView>
  );
}
