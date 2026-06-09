import { supabase } from './supabase';

export interface BlogBlock {
  type: 'paragraph' | 'heading' | 'image';
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Will store serialized BlogBlock[]
  image: string;
  author: string;
  published_at: string;
}

const LOCAL_STORAGE_KEY = 'socializea_blog_posts';

const initialPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Ako správne vybrať ozvučenie na svadbu?',
    excerpt: 'Plánujete svadbu a neviete akú aparatúru zvoliť? V tomto článku sa pozrieme na kľúčové faktory úspešného ozvučenia svadobného dňa.',
    content: JSON.stringify([
      { type: 'paragraph', value: 'Správny výber ozvučenia na svadbu závisí predovšetkým od troch základných faktorov: veľkosti sály, počtu pozvaných hostí a očakávaného charakteru zábavy. Podcenenie zvuku môže pokaziť inak skvelý program.' },
      { type: 'heading', value: 'Veľkosť miestnosti a počet osôb' },
      { type: 'paragraph', value: 'Pre menšie a stredné svadby (do 50 ľudí) si plne vystačíte s naším Párty Setom M, ktorý obsahuje dvojicu 12-palcových reproduktorov a stojany. Pokiaľ však plánujete svadbu pre viac ako 80 osôb, je dôležité doplniť zostavu o kvalitný subwoofer.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80' },
      { type: 'heading', value: 'Čomu sa vyhnúť pri výbere techniky?' },
      { type: 'paragraph', value: 'Určite sa vyvarujte prenájmu lacných neznačkových setov, ktoré majú nečitateľný zvuk. Naši technici vám preto s radosťou zapoja prémiovú techniku, ktorá má automaticky poistky proti prehriatiu, čím zaručuje plynulú zábavu až do ranných hodín.' }
    ]),
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
    author: 'Admin Team',
    published_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'blog-2',
    title: 'Trendy v svetelnom dizajne pre rok 2025',
    excerpt: 'Svetelná šou robí z obyčajného parketu nezabudnuteľný zážitok. Pozrite sa na najnovšie svetelné efekty a trendy.',
    content: JSON.stringify([
      { type: 'paragraph', value: 'Osvetlenie nie je iba praktickou nutnosťou na to, aby sme videli na krok. Na moderných svadbách a večierkoch je svetelný dizajn samostatným umením, ktoré formuje energiu celého večera.' },
      { type: 'heading', value: 'Inteligentné hlavy a priestorová hmla' },
      { type: 'paragraph', value: 'Veľkým trendom pre rok 2025 sú kompaktné LED otočné hlavy (Moving Heads) riadené v reálnom čase pomocou DMX protokolu. Tieto lúče nakreslia nádherné geometrické útvary priamo v sále.' },
      { type: 'image', value: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
      { type: 'heading', value: 'Ambientné nasvietenie sály' },
      { type: 'paragraph', value: 'Nezabúdajte na dekoračné wall-washing svetlá. Statické zafarbenie stien do príjemných teplých odtieňov (napríklad champagne alebo jantárová) okamžite premení akýkoľvek kulturák alebo stodolu na luxusnú banketovú miestnosť.' }
    ]),
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    author: 'Martin (DJ & Light designer)',
    published_at: new Date().toISOString()
  }
];

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialPosts));
        return initialPosts;
      }
      return JSON.parse(stored);
    }
  },

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const posts = await this.getAll();
      return posts.find(p => p.id === id) || null;
    }
  },

  async create(post: Omit<BlogPost, 'id' | 'published_at'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: crypto.randomUUID(),
      published_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          id: newPost.id,
          title: newPost.title,
          excerpt: newPost.excerpt,
          content: newPost.content,
          image: newPost.image,
          author: newPost.author,
          published_at: newPost.published_at
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const posts = await this.getAll();
      posts.unshift(newPost);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
      return newPost;
    }
  },

  async update(id: string, updatedFields: Partial<Omit<BlogPost, 'id' | 'published_at'>>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: updatedFields.title,
          excerpt: updatedFields.excerpt,
          content: updatedFields.content,
          image: updatedFields.image,
          author: updatedFields.author
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const posts = await this.getAll();
      const idx = posts.findIndex(p => p.id === id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...updatedFields };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
        return posts[idx];
      }
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      const posts = await this.getAll();
      const updated = posts.filter(p => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  }
};