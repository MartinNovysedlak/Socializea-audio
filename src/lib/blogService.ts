import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
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
    content: 'Správny výber ozvučenia na svadbu závisí od veľkosti sály, počtu hostí a charakteru zábavy. Pre stredne veľké svadby odporúčame náš Svadobný Set L, ktorý zahŕňa 15" satelity, masívny subwoofer a profesionálne ambientné osvetlenie. Dôležitá je tiež prítomnosť bezdrôtového mikrofónu pre moderátora.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
    author: 'Admin Team',
    published_at: new Date().toISOString()
  },
  {
    id: 'blog-2',
    title: 'Trendy v svetelnom dizajne pre rok 2025',
    excerpt: 'Svetelná šou robí z obyčajného parketu nezabudnuteľný zážitok. Pozrite sa na najnovšie svetelné efekty a trendy.',
    content: 'V roku 2025 dominujú inteligentné rotačné hlavy (Moving Heads) a holografické lasery spojené so sýtymi farbami a jemnou priestorovou hmlou z dymostrojov. Tiež narastá záujem o architektonické nasvietenie stien pomocou LED barov, ktoré dodá priestoru výnimočnú hĺbku a luxusný nádych.',
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

  async create(post: Omit<BlogPost, 'id' | 'published_at'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: crypto.randomUUID(),
      published_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
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
        .update(updatedFields)
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