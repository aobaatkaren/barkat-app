import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Chip, Field, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { CATEGORY_LABEL, CITY_LABEL } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { CITIES, type Category, type City } from '@/lib/types';

const CATS: Category[] = ['bakery', 'restaurant', 'grocery', 'cafe'];

export default function RegisterShop() {
  const { t, lang, registerShop, city: defaultCity } = useStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('bakery');
  const [city, setCity] = useState<City>(defaultCity);
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (!name.trim() || !area.trim() || !address.trim()) return setError(true);
    registerShop({ name: name.trim(), category, city, area: area.trim(), address: address.trim() });
    router.replace('/shop');
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <T style={s.muted}>{t('merchantPitch')}</T>
      <Field label={t('shopName')} value={name} onChangeText={setName} />
      <T style={s.label}>{t('category')}</T>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {CATS.map((c) => (
          <Chip key={c} label={CATEGORY_LABEL[lang][c]} active={c === category} onPress={() => setCategory(c)} />
        ))}
      </View>
      <T style={s.label}>{t('city')}</T>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {CITIES.map((c) => (
          <Chip key={c} label={CITY_LABEL[lang][c]} active={c === city} onPress={() => setCity(c)} />
        ))}
      </View>
      <Field label={t('area')} value={area} onChangeText={setArea} placeholder="DHA Phase 5" />
      <Field label={t('address')} value={address} onChangeText={setAddress} />
      {error && <T style={{ color: C.danger }}>{t('required')}</T>}
      <Button title={t('register')} onPress={submit} />
    </ScrollView>
  );
}
