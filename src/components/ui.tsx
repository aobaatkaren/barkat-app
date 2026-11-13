import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type TextProps, type ViewStyle } from 'react-native';

import { C, R } from '@/constants/theme';
import { useStore } from '@/lib/store';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export const Icon = MaterialCommunityIcons;

/** Text that right-aligns itself when the app is in Urdu. */
export function T({ style, ...p }: TextProps) {
  const { isRTL } = useStore();
  return <Text {...p} style={[{ color: C.text, textAlign: isRTL ? 'right' : 'left' }, style]} />;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  icon?: IconName;
  style?: ViewStyle;
}) {
  const fg = variant === 'primary' ? '#fff' : variant === 'danger' ? C.danger : C.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        variant === 'primary' && { backgroundColor: C.primary },
        variant !== 'primary' && { borderWidth: 1.5, borderColor: fg, backgroundColor: 'transparent' },
        (pressed || disabled) && { opacity: disabled ? 0.45 : 0.8 },
        style,
      ]}>
      {icon && <Icon name={icon} size={18} color={fg} />}
      <Text style={[s.btnText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...p }: TextInputProps & { label: string }) {
  const { isRTL } = useStore();
  return (
    <View style={{ gap: 6 }}>
      <T style={s.label}>{label}</T>
      <TextInput
        placeholderTextColor={C.muted}
        {...p}
        style={[s.input, { textAlign: isRTL ? 'right' : 'left' }, p.multiline && { minHeight: 80, textAlignVertical: 'top' }, p.style]}
      />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: C.primary, borderColor: C.primary }]}>
      <Text style={{ color: active ? '#fff' : C.text, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function Empty({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={{ alignItems: 'center', padding: 40, gap: 12 }}>
      <Icon name={icon} size={48} color={C.muted} />
      <Text style={{ color: C.muted, textAlign: 'center', fontSize: 15 }}>{text}</Text>
    </View>
  );
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  h1: { fontSize: 24, fontWeight: '800' },
  h2: { fontSize: 18, fontWeight: '700' },
  muted: { color: C.muted },
  label: { fontSize: 13, fontWeight: '600', color: C.muted },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: C.text,
  },
  btn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: R.md,
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
  },
});
