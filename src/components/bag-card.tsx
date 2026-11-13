import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, R } from '@/constants/theme';
import { CATEGORY_ICON, CATEGORY_LABEL, formatPKR, timeRange } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import type { Bag, Merchant } from '@/lib/types';

import { Icon, T, type IconName } from './ui';

export function BagCard({ bag, merchant }: { bag: Bag; merchant: Merchant }) {
  const { t, lang, isRTL } = useStore();
  const soldOut = bag.quantityLeft <= 0;
  const off = Math.round((1 - bag.price / bag.originalPrice) * 100);
  const row = isRTL ? 'row-reverse' : 'row';

  return (
    <Link href={{ pathname: '/deal/[id]', params: { id: bag.id } }} asChild>
      <Pressable style={({ pressed }) => [st.card, pressed && { opacity: 0.85 }, soldOut && { opacity: 0.55 }]}>
        <View style={[st.banner, { flexDirection: row }]}>
          <View style={st.iconWrap}>
            <Icon name={CATEGORY_ICON[merchant.category] as IconName} size={26} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <T style={st.merchant} numberOfLines={1}>{merchant.name}</T>
            <T style={st.area} numberOfLines={1}>
              {CATEGORY_LABEL[lang][merchant.category]} · {merchant.area}
            </T>
          </View>
          <View style={[st.badge, soldOut && { backgroundColor: C.border }]}>
            <Text style={st.badgeText}>{soldOut ? t('soldOut') : `${bag.quantityLeft} ${t('left')}`}</Text>
          </View>
        </View>
        <View style={{ padding: 14, gap: 6 }}>
          <T style={st.title}>{bag.title}</T>
          <View style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: row, alignItems: 'center', gap: 6 }}>
              <Icon name="clock-outline" size={16} color={C.muted} />
              <Text style={{ color: C.muted }}>
                {t('pickup')} {t('today')} {timeRange(bag.pickupStart, bag.pickupEnd)}
              </Text>
            </View>
            <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
              <Text style={st.strike}>{formatPKR(bag.originalPrice)}</Text>
              <Text style={st.price}>{formatPKR(bag.price)}</Text>
            </View>
          </View>
          <View style={[st.off, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={{ color: '#8A5A12', fontWeight: '700', fontSize: 12 }}>-{off}%</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  banner: { backgroundColor: C.primarySoft, padding: 14, gap: 12, alignItems: 'center' },
  iconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  merchant: { fontSize: 16, fontWeight: '700' },
  area: { color: C.muted, fontSize: 13 },
  badge: { backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#3B2A0A', fontWeight: '700', fontSize: 12 },
  title: { fontSize: 17, fontWeight: '700' },
  strike: { color: C.muted, textDecorationLine: 'line-through', fontSize: 12 },
  price: { color: C.primary, fontWeight: '800', fontSize: 18 },
  off: { backgroundColor: C.accentSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
});
