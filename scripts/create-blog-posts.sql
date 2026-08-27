create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  excerpt text not null default '',
  content text not null default '[]',
  image text not null default '',
  author text not null default 'Admin Team',
  published_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "Allow public select" on public.blog_posts;
drop policy if exists "Allow public insert" on public.blog_posts;
drop policy if exists "Allow public update" on public.blog_posts;
drop policy if exists "Allow public delete" on public.blog_posts;
drop policy if exists "Allow all for anon" on public.blog_posts;

create policy "Allow public select" on public.blog_posts for select to public using (true);
create policy "Allow public insert" on public.blog_posts for insert to public with check (true);
create policy "Allow public update" on public.blog_posts for update to public using (true) with check (true);
create policy "Allow public delete" on public.blog_posts for delete to public using (true);
create policy "Allow all for anon" on public.blog_posts for all to anon using (true) with check (true);

grant select, insert, update, delete on public.blog_posts to anon, authenticated;

insert into public.blog_posts (id, title, excerpt, content, image, author, published_at)
values
  (
    'blog-1',
    'Ako správne vybrať ozvučenie na svadbu?',
    'Plánujete svadbu a neviete akú aparatúru zvoliť? V tomto článku sa pozrieme na kľúčové faktory úspešného ozvučenia svadobného dňa.',
    $c$[{"type":"paragraph","value":"Správny výber ozvučenia na svadbu závisí predovšetkým od troch základných faktorov: veľkosti sály, počtu pozvaných hostí a očakávaného charakteru zábavy. Podcenenie zvuku môže pokaziť inak skvelý program."},{"type":"heading","value":"Veľkosť miestnosti a počet osôb"},{"type":"paragraph","value":"Pre menšie a stredné svadby (do 50 ľudí) si plne vystačíte s naším Párty Setom M, ktorý obsahuje dvojicu 12-palcových reproduktorov a stojany. Pokiaľ však plánujete svadbu pre viac ako 80 osôb, je dôležité doplniť zostavu o kvalitný subwoofer."},{"type":"image","value":"https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80"},{"type":"heading","value":"Čomu sa vyhnúť pri výbere techniky?"},{"type":"paragraph","value":"Určite sa vyvarujte prenájmu lacných neznačkových setov, ktoré majú nečitateľný zvuk. Naši technici vám preto s radosťou zapoja prémiovú techniku, ktorá má automaticky poistky proti prehriatiu, čím zaručuje plynulú zábavu až do ranných hodín."}]$c$,
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
    'Admin Team',
    '2026-06-07T10:00:00Z'
  ),
  (
    'blog-2',
    'Trendy v svetelnom dizajne pre rok 2025',
    'Svetelná šou robí z obyčajného parketu nezabudnuteľný zážitok. Pozrite sa na najnovšie svetelné efekty a trendy.',
    $c$[{"type":"paragraph","value":"Osvetlenie nie je iba praktickou nutnosťou na to, aby sme videli na krok. Na moderných svadbách a večierkoch je svetelný dizajn samostatným umením, ktoré formuje energiu celého večera."},{"type":"heading","value":"Inteligentné hlavy a priestorová hmla"},{"type":"paragraph","value":"Veľkým trendom pre rok 2025 sú kompaktné LED otočné hlavy (Moving Heads) riadené v reálnom čase pomocou DMX protokolu. Tieto lúče nakreslia nádherné geometrické útvary priamo v sále."},{"type":"image","value":"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80"},{"type":"heading","value":"Ambientné nasvietenie sály"},{"type":"paragraph","value":"Nezabúdajte na dekoračné wall-washing svetlá. Statické zafarbenie stien do príjemných teplých odtieňov (napríklad champagne alebo jantárová) okamžite premení akýkoľvek kulturák alebo stodolu na luxusnú banketovú miestnosť."}]$c$,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    'Martin (DJ & Light designer)',
    '2026-06-08T10:00:00Z'
  )
on conflict (id) do nothing;
