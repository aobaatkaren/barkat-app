import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Card, Chip, s, T } from '@/components/ui';
import { CITY_LABEL } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { CITIES } from '@/lib/types';

export default function Profile() {
  const { t, lang, setLang, city, setCity, user, signOut, isRTL } = useStore();
  const row = isRTL ? 'row-reverse' : 'row';

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      {user ? (
        <Card>
          <T style={s.h2}>{user.name}</T>
          <T style={s.muted}>{user.phone}</T>
        </Card>
      ) : (
        <Button title={t('login')} icon="login" onPress={() => router.push('/login')} />
      )}

      <Card>
        <T style={s.label}>{t('language')}</T>
        <View style={{ flexDirection: row, gap: 8 }}>
          <Chip label="English" active={lang === 'en'} onPress={() => setLang('en')} />
          <Chip label="اردو" active={lang === 'ur'} onPress={() => setLang('ur')} />
        </View>
        <T style={[s.label, { marginTop: 8 }]}>{t('city')}</T>
        <View style={{ flexDirection: row, gap: 8, flexWrap: 'wrap' }}>
          {CITIES.map((c) => (
            <Chip key={c} label={CITY_LABEL[lang][c]} active={c === city} onPress={() => setCity(c)} />
          ))}
        </View>
      </Card>

      {user && !user.merchantId && (
        <Card>
          <T style={s.h2}>{t('becomeMerchant')}</T>
          <T style={s.muted}>{t('merchantPitch')}</T>
          <Button title={t('becomeMerchant')} icon="storefront-outline" variant="outline" onPress={() => router.push('/shop/register')} />
        </Card>
      )}

      {user && <Button title={t('logout')} variant="danger" onPress={signOut} />}
    </ScrollView>
  );
}
