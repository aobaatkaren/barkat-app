-- Barkat backend schema for Supabase (Postgres).
-- Run this in the Supabase SQL editor when you are ready to move from demo mode
-- to a real shared backend. Mirrors the types in src/lib/types.ts.

create type merchant_category as enum ('bakery', 'restaurant', 'grocery', 'cafe');
create type order_status as enum ('reserved', 'collected', 'cancelled');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  phone text not null unique,
  city text not null default 'Karachi',
  created_at timestamptz not null default now()
);

create table merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles on delete cascade,
  name text not null,
  category merchant_category not null,
  city text not null,
  area text not null,
  address text not null,
  phone text not null,
  approved boolean not null default false, -- admin approves before shop goes live
  created_at timestamptz not null default now()
);

create table bags (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants on delete cascade,
  title text not null,
  description text not null,
  original_price integer not null check (original_price > 0),
  price integer not null check (price > 0 and price < original_price),
  quantity_left integer not null check (quantity_left >= 0),
  pickup_start time not null,
  pickup_end time not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  bag_id uuid not null references bags,
  merchant_id uuid not null references merchants,
  customer_id uuid not null references profiles,
  quantity integer not null check (quantity between 1 and 3),
  total integer not null,
  pickup_code text not null,
  status order_status not null default 'reserved',
  created_at timestamptz not null default now()
);

-- Reserve atomically so two customers can't buy the last bag at the same time.
create or replace function reserve_bag(p_bag uuid, p_qty integer)
returns orders language plpgsql security definer set search_path = public as $$
declare b bags; o orders;
begin
  update bags set quantity_left = quantity_left - p_qty
   where id = p_bag and active and quantity_left >= p_qty
   returning * into b;
  if not found then raise exception 'Bag unavailable'; end if;
  insert into orders (bag_id, merchant_id, customer_id, quantity, total, pickup_code)
  values (b.id, b.merchant_id, auth.uid(), p_qty, b.price * p_qty,
          upper(substr(md5(random()::text), 1, 5)))
  returning * into o;
  return o;
end $$;

-- Row Level Security
alter table profiles enable row level security;
alter table merchants enable row level security;
alter table bags enable row level security;
alter table orders enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());

create policy "approved merchants are public" on merchants for select using (approved or owner_id = auth.uid());
create policy "owner manages merchant" on merchants for insert with check (owner_id = auth.uid());
create policy "owner updates merchant" on merchants for update using (owner_id = auth.uid());

create policy "bags are public" on bags for select using (true);
create policy "merchant manages bags" on bags for all
  using (merchant_id in (select id from merchants where owner_id = auth.uid()))
  with check (merchant_id in (select id from merchants where owner_id = auth.uid()));

create policy "customer sees own orders" on orders for select using (customer_id = auth.uid());
create policy "merchant sees shop orders" on orders for select
  using (merchant_id in (select id from merchants where owner_id = auth.uid()));
create policy "customer cancels own order" on orders for update
  using (customer_id = auth.uid() and status = 'reserved');
create policy "merchant marks collected" on orders for update
  using (merchant_id in (select id from merchants where owner_id = auth.uid()));
