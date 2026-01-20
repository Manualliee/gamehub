create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  game_id integer not null,
  name text not null,
  price numeric not null,
  image text
);