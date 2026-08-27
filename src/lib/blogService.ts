import { supabase } from './supabase';

export interface BlogBlock {
  type: 'paragraph' | 'heading' | 'image';
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published_at: string;
}

const LOCAL_STORAGE_KEY = 'socializea_blog_posts';

function readLocalPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((p: BlogPost) => p?.id && p?.title) : [];
  } catch {
    return [];
  }
}

function clearLocalPosts() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

let localMigrated = false;

async function migrateLocalPosts() {
  if (localMigrated || typeof localStorage === 'undefined') {
    localMigrated = true;
    return;
  }
  localMigrated = true;

  const localPosts = readLocalPosts();
  if (localPosts.length > 0) {
    const { error } = await supabase.from('blog_posts').upsert(localPosts, { onConflict: 'id' });
    if (error) console.error('Error migrating blog posts:', error);
  }
  clearLocalPosts();
}

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    await migrateLocalPosts();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  },

  async getById(id: string): Promise<BlogPost | null> {
    await migrateLocalPosts();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  },

  async create(post: Omit<BlogPost, 'id' | 'published_at'>): Promise<BlogPost | null> {
    await migrateLocalPosts();
    const newPost: BlogPost = {
      ...post,
      id: crypto.randomUUID(),
      published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        id: newPost.id,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        image: newPost.image,
        author: newPost.author,
        published_at: newPost.published_at,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }

    return data;
  },

  async update(id: string, updatedFields: Partial<Omit<BlogPost, 'id' | 'published_at'>>): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: updatedFields.title,
        excerpt: updatedFields.excerpt,
        content: updatedFields.content,
        image: updatedFields.image,
        author: updatedFields.author,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  },
};
