CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  sound_specs TEXT[] NOT NULL DEFAULT '{}',
  light_specs TEXT[] NOT NULL DEFAULT '{}',
  other_specs TEXT[] NOT NULL DEFAULT '{}',
  price_no_lights NUMERIC(10,2) NOT NULL,
  price_with_lights NUMERIC(10,2) NOT NULL,
  is_popular BOOLEAN DEFAULT false
);