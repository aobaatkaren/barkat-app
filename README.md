# Barkat

Barkat is a surplus-food app for Pakistan, built for iOS and Android. Restaurants, bakeries and grocers list food they have left at closing time as discounted "surprise bags". Customers reserve a bag, get a pickup code, and pay in cash when they collect it.

It is built with **React Native + Expo** (SDK 58), so one codebase runs on iOS, Android and the web.

## Features (version 1)

**Customers**
- Browse surplus bags by city (Karachi, Lahore, Islamabad), with price, discount and pickup time.
- Reserve 1–3 bags and pay at pickup (online payments come later).
- Get a 5-character pickup code, and cancel a reservation if needed.
- See bags rescued and money saved.
- Sign in with a mobile number and OTP.
- Use the app in English or Urdu.

**Shops (merchants)**
- Register a shop from the Profile tab.
- Add bags with price, original value, quantity and pickup window, and hide or show them.
- Check a customer's pickup code and mark the order collected.
- See all reservations.

## Run it on your phone

1. Install [Node.js](https://nodejs.org) (LTS) and, if you like, [VS Code](https://code.visualstudio.com).
2. Install **Expo Go** on your phone from the App Store or Play Store.
3. In this folder, run:

   ```bash
   npm install
   npx expo start
   ```

4. Scan the QR code with your phone's camera on iOS, or with Expo Go on Android.

**Demo mode:** the OTP is always `1234`. Data is stored on the phone only, so each phone has its own copy.

## Project structure

```
src/app/                 Screens (Expo Router: each file is a screen)
  (tabs)/index.tsx       Discover: bags in the selected city
  (tabs)/orders.tsx      My orders
  (tabs)/shop.tsx        Merchant dashboard (only shown for shop owners)
  (tabs)/profile.tsx     Sign in, language, city, register shop
  deal/[id].tsx          Bag details and reservation
  order/[id].tsx         Pickup code
  login.tsx              Phone and OTP sign-in
  shop/register.tsx      Register a shop
  shop/new-bag.tsx       Add a bag
src/lib/store.tsx        All data logic (demo mode: on-device storage)
src/lib/i18n.ts          English and Urdu text
src/lib/seed.ts          Demo shops and bags
supabase/schema.sql      Database schema for the real backend
```

## Roadmap

1. **Real backend:** create a free [Supabase](https://supabase.com) project, run `supabase/schema.sql`, and replace the functions in `src/lib/store.tsx` with Supabase calls. Customers and shops then share live data.
2. **SMS OTP:** connect an SMS provider to Supabase Auth, such as Twilio or a local Pakistani SMS gateway.
3. **Admin approval** for new shops (the `approved` column already exists).
4. **Maps and distance**, plus push notifications such as "your favourite bakery just listed a bag".
5. **Online payments:** JazzCash, Easypaisa and cards through a gateway such as Safepay or PayFast. These need business registration.
6. **Publish** with EAS Build (`npx eas-cli build`), which builds the iOS app in the cloud without a Mac. You'll need an Apple Developer account ($99/yr) and a Google Play Console account ($25 once).
