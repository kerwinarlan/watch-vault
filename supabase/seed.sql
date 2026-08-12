-- ChronoVault sample catalog (run after schema.sql)
insert into public.watches (title, brand, reference, price, currency, condition, status, images) values
  ('Submariner Date 126610LN', 'Rolex', '126610LN', 12500, 'USD', 'New', 'Available',
   array['https://picsum.photos/seed/rolex1/900/700', 'https://picsum.photos/seed/rolex2/900/700']),
  ('Speedmaster Professional Moonwatch', 'Omega', '310.30.42.50.01.001', 6800, 'USD', 'Pre-owned', 'Available',
   array['https://picsum.photos/seed/omega1/900/700']),
  ('Nautilus 5711/1A', 'Patek Philippe', '5711/1A-010', 85000, 'USD', 'Mint', 'Reserved',
   array['https://picsum.photos/seed/patek1/900/700', 'https://picsum.photos/seed/patek2/900/700']),
  ('Royal Oak 15500ST', 'Audemars Piguet', '15500ST.OO.1220ST.01', 45000, 'USD', 'Pre-owned', 'Available',
   array['https://picsum.photos/seed/ap1/900/700']),
  ('Black Bay 58', 'Tudor', 'M79030B-0001', 390000, 'PHP', 'New', 'Sold',
   array['https://picsum.photos/seed/tudor1/900/700', 'https://picsum.photos/seed/tudor2/900/700']);
