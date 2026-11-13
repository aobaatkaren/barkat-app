import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';

import { Button, Field, s, T } from '@/components/ui';
import { C } from '@/constants/theme';
import { useStore } from '@/lib/store';

/**
 * Phone + OTP sign-in.
 * Demo mode accepts 1234. With Supabase connected this becomes
 * supabase.auth.signInWithOtp({ phone }) + verifyOtp() (needs an SMS provider).
 */
export default function Login() {
  const { t, signIn } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validPhone = /^03\d{9}$/.test(phone.replace(/[\s-]/g, ''));

  const verify = () => {
    if (otp !== '1234') {
      setError('✗');
      return;
    }
    signIn(name.trim(), phone.replace(/[\s-]/g, ''));
    router.back();
  };

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 32, fontWeight: '900', color: C.primary }}>Barkat</Text>
        <T style={s.muted}>{t('appTagline')}</T>

        <Field label={t('name')} value={name} onChangeText={setName} autoComplete="name" editable={!sent} />
        <Field
          label={t('phone')}
          value={phone}
          onChangeText={setPhone}
          placeholder="03XX XXXXXXX"
          keyboardType="phone-pad"
          editable={!sent}
        />

        {!sent ? (
          <Button title={t('sendCode')} disabled={!validPhone || !name.trim()} onPress={() => setSent(true)} />
        ) : (
          <>
            <Field label={t('enterOtp')} value={otp} onChangeText={(v) => (setOtp(v), setError(''))} keyboardType="number-pad" maxLength={4} />
            <T style={{ color: C.accent, fontWeight: '600' }}>{t('demoOtp')}</T>
            {!!error && <T style={{ color: C.danger }}>{error}</T>}
            <Button title={t('verify')} disabled={otp.length !== 4} onPress={verify} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
