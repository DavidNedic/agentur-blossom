CREATE TABLE public.technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  pin_hash TEXT,
  user_id UUID,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL DEFAULT '',
  obj_type TEXT NOT NULL DEFAULT 'Stan',
  infra TEXT NOT NULL DEFAULT 'Nova instalacija',
  date DATE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  tehnicar_id TEXT REFERENCES public.technicians(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_tehnicar_idx ON public.orders (tehnicar_id, status);

GRANT SELECT ON public.technicians TO anon, authenticated;
GRANT ALL ON public.technicians TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "technicians_public_read" ON public.technicians FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "orders_public_read" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "orders_public_update_status" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.technicians (id, name) VALUES
  ('marko', 'Marko Jovanović'),
  ('ana', 'Ana Petrović'),
  ('filip', 'Filip Nikolić');

ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;