import type { Bag, Merchant } from './types';

// Demo data so the app is usable before the backend is connected.
export const SEED_MERCHANTS: Merchant[] = [
  { id: 'm1', name: 'Crust & Crumb Bakery', category: 'bakery', city: 'Karachi', area: 'DHA Phase 6', address: 'Bukhari Commercial, Lane 4', phone: '0300-0000001' },
  { id: 'm2', name: 'Biryani Junction', category: 'restaurant', city: 'Karachi', area: 'Gulshan-e-Iqbal', address: 'Block 13-D, Main University Rd', phone: '0300-0000002' },
  { id: 'm3', name: 'Daily Fresh Mart', category: 'grocery', city: 'Karachi', area: 'Clifton', address: 'Block 5, Khayaban-e-Roomi', phone: '0300-0000003' },
  { id: 'm4', name: 'Lahori Nashta House', category: 'restaurant', city: 'Lahore', area: 'Gulberg III', address: 'MM Alam Road', phone: '0300-0000004' },
  { id: 'm5', name: 'Sweet Corner', category: 'bakery', city: 'Lahore', area: 'Johar Town', address: 'Block G1, Main Boulevard', phone: '0300-0000005' },
  { id: 'm6', name: 'Margalla Café', category: 'cafe', city: 'Islamabad', area: 'F-7 Markaz', address: 'Jinnah Super Market', phone: '0300-0000006' },
  { id: 'm7', name: 'Capital Grocers', category: 'grocery', city: 'Islamabad', area: 'G-11 Markaz', address: 'Main Markaz Road', phone: '0300-0000007' },
];

export const SEED_BAGS: Bag[] = [
  { id: 'b1', merchantId: 'm1', title: 'Bread & Pastry Bag', description: 'A surprise mix of today’s bread, buns, croissants and cake slices.', originalPrice: 1500, price: 499, quantityLeft: 5, pickupStart: '21:00', pickupEnd: '22:00', active: true },
  { id: 'b2', merchantId: 'm2', title: 'Biryani Family Box', description: 'Chicken biryani, raita and salad left over from the evening rush. Serves 2–3.', originalPrice: 1800, price: 650, quantityLeft: 3, pickupStart: '22:30', pickupEnd: '23:30', active: true },
  { id: 'b3', merchantId: 'm3', title: 'Fruit & Veg Bag', description: 'Fresh produce close to its best-before date. Around 3 kg.', originalPrice: 1200, price: 399, quantityLeft: 8, pickupStart: '19:00', pickupEnd: '21:00', active: true },
  { id: 'b4', merchantId: 'm4', title: 'Halwa Puri Combo', description: 'Leftover halwa, puri and chanay from the morning service.', originalPrice: 900, price: 299, quantityLeft: 4, pickupStart: '12:00', pickupEnd: '13:00', active: true },
  { id: 'b5', merchantId: 'm5', title: 'Mithai Surprise Box', description: 'Half a kilo of assorted mithai from today’s display.', originalPrice: 1400, price: 550, quantityLeft: 6, pickupStart: '21:30', pickupEnd: '22:30', active: true },
  { id: 'b6', merchantId: 'm6', title: 'Café Leftovers Bag', description: 'Sandwiches, muffins and a cookie or two.', originalPrice: 1600, price: 600, quantityLeft: 2, pickupStart: '20:30', pickupEnd: '21:30', active: true },
  { id: 'b7', merchantId: 'm7', title: 'Dairy & Bakery Bag', description: 'Milk, yogurt, bread and eggs near their date.', originalPrice: 1100, price: 420, quantityLeft: 5, pickupStart: '20:00', pickupEnd: '22:00', active: true },
];
