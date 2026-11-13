import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DICTS, type TKey } from './i18n';
import { SEED_BAGS, SEED_MERCHANTS } from './seed';
import type { Bag, City, Lang, Merchant, Order, User } from './types';

/**
 * Local data store (demo mode).
 *
 * Everything is kept on the device in AsyncStorage so the app works end to end
 * without a server. The shape mirrors the Supabase tables in supabase/schema.sql,
 * so swapping this for real API calls later only touches this file.
 */

type State = {
  lang: Lang;
  city: City;
  user: User | null;
  merchants: Merchant[];
  bags: Bag[];
  orders: Order[];
};

type Store = State & {
  ready: boolean;
  t: (k: TKey) => string;
  isRTL: boolean;
  setLang: (l: Lang) => void;
  setCity: (c: City) => void;
  signIn: (name: string, phone: string) => void;
  signOut: () => void;
  reserve: (bagId: string, qty: number) => Order;
  cancelOrder: (orderId: string) => void;
  registerShop: (m: Omit<Merchant, 'id' | 'phone'>) => void;
  saveBag: (b: Omit<Bag, 'id' | 'merchantId' | 'active'>) => void;
  toggleBag: (bagId: string) => void;
  collectByCode: (code: string) => Order | null;
};

const KEY = 'barkat-state-v1';

const initial = (): State => ({
  lang: getLocales()[0]?.languageCode === 'ur' ? 'ur' : 'en',
  city: 'Karachi',
  user: null,
  merchants: SEED_MERCHANTS,
  bags: SEED_BAGS,
  orders: [],
});

const id = () => Math.random().toString(36).slice(2, 10);
const code = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setState({ ...initial(), ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const t = useCallback((k: TKey) => DICTS[state.lang][k], [state.lang]);

  const reserve = useCallback(
    (bagId: string, qty: number) => {
      const bag = state.bags.find((b) => b.id === bagId);
      if (!bag || !state.user || bag.quantityLeft < qty) throw new Error('unavailable');
      const order: Order = {
        id: id(),
        bagId,
        merchantId: bag.merchantId,
        customerName: state.user.name,
        customerPhone: state.user.phone,
        quantity: qty,
        total: bag.price * qty,
        pickupCode: code(),
        status: 'reserved',
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        orders: [order, ...s.orders],
        bags: s.bags.map((b) => (b.id === bagId ? { ...b, quantityLeft: b.quantityLeft - qty } : b)),
      }));
      return order;
    },
    [state.bags, state.user],
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      t,
      isRTL: state.lang === 'ur',
      setLang: (lang) => setState((s) => ({ ...s, lang })),
      setCity: (city) => setState((s) => ({ ...s, city })),
      signIn: (name, phone) => setState((s) => ({ ...s, user: { name, phone, city: s.city, merchantId: s.user?.phone === phone ? s.user.merchantId : undefined } })),
      signOut: () => setState((s) => ({ ...s, user: null })),
      reserve,
      cancelOrder: (orderId) =>
        setState((s) => {
          const o = s.orders.find((x) => x.id === orderId);
          if (!o || o.status !== 'reserved') return s;
          return {
            ...s,
            orders: s.orders.map((x) => (x.id === orderId ? { ...x, status: 'cancelled' } : x)),
            bags: s.bags.map((b) => (b.id === o.bagId ? { ...b, quantityLeft: b.quantityLeft + o.quantity } : b)),
          };
        }),
      registerShop: (m) =>
        setState((s) => {
          if (!s.user) return s;
          const merchant: Merchant = { ...m, id: id(), phone: s.user.phone };
          return { ...s, merchants: [...s.merchants, merchant], user: { ...s.user, merchantId: merchant.id } };
        }),
      saveBag: (b) =>
        setState((s) =>
          s.user?.merchantId ? { ...s, bags: [{ ...b, id: id(), merchantId: s.user.merchantId, active: true }, ...s.bags] } : s,
        ),
      toggleBag: (bagId) => setState((s) => ({ ...s, bags: s.bags.map((b) => (b.id === bagId ? { ...b, active: !b.active } : b)) })),
      collectByCode: (input) => {
        const c = input.trim().toUpperCase();
        const o = state.orders.find(
          (x) => x.pickupCode === c && x.status === 'reserved' && x.merchantId === state.user?.merchantId,
        );
        if (!o) return null;
        setState((s) => ({ ...s, orders: s.orders.map((x) => (x.id === o.id ? { ...x, status: 'collected' } : x)) }));
        return { ...o, status: 'collected' };
      },
    }),
    [state, ready, t, reserve],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
