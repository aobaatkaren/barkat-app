import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BagCard } from '@/components/bag-card';
import { Chip, Empty, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { CITY_LABEL, formatPKR } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { CITIES } from '@/lib/types';

export default function Discover() {
  const { t, lang, city, setCity, bags, merchants, user, orders, isRTL } = useStore();

  const list = bags
    .filter((b) => b.active)
    .map((b) => ({ bag: b, merchant: merchants.find((m) => m.id === b.merchantId)! }))
    .filter((x) => x.merchant?.city === city)
    .sort((a, b) => Number(b.bag.quantityLeft > 0) - Number(a.bag.quantityLeft > 0));

  const rescued = orders.filter((o) => o.status !== 'cancelled' && o.customerPhone === user?.phone);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <FlatList
        data={list}
        keyExtractor={(x) => x.bag.id}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <View style={{ gap: 14 }}>
            <View style={st.hero}>
              <Text style={st.logo}>Barkat</Text>
              <T style={st.tagline}>{t('appTagline')}</T>
              {user && rescued.length > 0 && (
                <View style={[st.stats, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Stat n={String(rescued.reduce((a, o) => a + o.quantity, 0))} label={t('mealsSaved')} />
                  <Stat
                    n={formatPKR(
                      rescued.reduce((a, o) => {
                        const b = bags.find((x) => x.id === o.bagId);
                        return a + (b ? (b.originalPrice - b.price) * o.quantity : 0);
                      }, 0),
                    )}
                    label={t('moneySaved')}
                  />
                </View>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CITIES.map((c) => (
                <Chip key={c} label={CITY_LABEL[lang][c]} active={c === city} onPress={() => setCity(c)} />
              ))}
            </ScrollView>
            <T style={s.h2}>
              {t('bagsNear')} {CITY_LABEL[lang][city]}
            </T>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <BagCard bag={item.bag} merchant={item.merchant} />}
        ListEmptyComponent={<Empty icon="food-off-outline" text={t('noBags')} />}
      />
    </SafeAreaView>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View style={{ flex: 1 }}>
      <T style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>{n}</T>
      <T style={{ color: '#CDE8D8', fontSize: 12 }}>{label}</T>
    </View>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: C.primary, borderRadius: 22, padding: 20, gap: 4 },
  logo: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: 0.5 },
  tagline: { color: '#DDF0E5', fontSize: 15 },
  stats: { flexDirection: 'row', marginTop: 12, gap: 12 },
});
