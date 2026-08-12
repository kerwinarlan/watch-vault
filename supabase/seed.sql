-- The Watch Alley PH sample catalog (run after schema.sql)
insert into public.watches (title, brand, reference, price, currency, condition, status, images) values
  ('Heritage "Snowflake" SBGA211', 'Grand Seiko', 'SBGA211', 520000, 'PHP', 'Mint', 'Available',
   array['https://picsum.photos/seed/gs1/900/700', 'https://picsum.photos/seed/gs2/900/700']),
  ('Prospex MarineMaster SLA043', 'Seiko', 'SLA043', 165000, 'PHP', 'Pre-owned', 'Available',
   array['https://picsum.photos/seed/seiko1/900/700']),
  ('Presage Sharp Edged SARX055', 'Seiko', 'SARX055', 42000, 'PHP', 'New', 'Available',
   array['https://picsum.photos/seed/seiko2/900/700', 'https://picsum.photos/seed/seiko3/900/700']),
  ('Black Bay 58 M79030N', 'Tudor', 'M79030N-0001', 245000, 'PHP', 'Pre-owned', 'Available',
   array['https://picsum.photos/seed/tudor1/900/700']),
  ('Submariner Date 126610LN', 'Rolex', '126610LN', 1450000, 'PHP', 'Pre-owned', 'Reserved',
   array['https://picsum.photos/seed/rolex1/900/700', 'https://picsum.photos/seed/rolex2/900/700']),
  ('Speedmaster Professional Moonwatch', 'Omega', '310.30.42.50.01.001', 690000, 'PHP', 'Pre-owned', 'Available',
   array['https://picsum.photos/seed/omega1/900/700']),
  ('Promaster Diver NB6021-17L', 'Citizen', 'NB6021-17L', 28000, 'PHP', 'New', 'Available',
   array['https://picsum.photos/seed/citizen1/900/700']),
  ('G-Shock "CasiOak" GA-2100', 'Casio', 'GA-2100-1A1', 4500, 'PHP', 'New', 'Sold',
   array['https://picsum.photos/seed/casio1/900/700', 'https://picsum.photos/seed/casio2/900/700']);
