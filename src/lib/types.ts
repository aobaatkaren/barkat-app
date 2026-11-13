export type City = 'Karachi' | 'Lahore' | 'Islamabad';
export const CITIES: City[] = ['Karachi', 'Lahore', 'Islamabad'];

export type Category = 'bakery' | 'restaurant' | 'grocery' | 'cafe';

export type Merchant = {
  id: string;
  name: string;
  category: Category;
  city: City;
  area: string;
  address: string;
  phone: string;
};

export type Bag = {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  originalPrice: number; // PKR
  price: number; // PKR
  quantityLeft: number;
  pickupStart: string; // "20:00"
  pickupEnd: string; // "21:30"
  active: boolean;
};

export type OrderStatus = 'reserved' | 'collected' | 'cancelled';

export type Order = {
  id: string;
  bagId: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  total: number;
  pickupCode: string;
  status: OrderStatus;
  createdAt: string;
};

export type User = {
  name: string;
  phone: string;
  city: City;
  /** set when the user registers a shop */
  merchantId?: string;
};

export type Lang = 'en' | 'ur';
