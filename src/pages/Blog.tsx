"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import { blogService, BlogPost } from '@/lib/blogService';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const data = await blogService.getAll();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-6">
            <BookOpen size={16} />
            <span>Socializea-audio Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Rady, tipy & novinky <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
              zo sveta audio-techniky
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Prečítajte si odborné články o správnom nastavení svetiel, výbere ozvučenia a najnovších trendoch v eventovej technike.
          </p>
        </div>

        {/* POSTS GRID */}
        {loading ? (
          <div className="text-center text-gray-400 py-16">Pripravujem blogové príspevky...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-white/5 border border-white/10 rounded-2xl max-w-5xl mx-auto">
            Žiadne uverejnené články na tejto stránke.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map(post => {
              const displayImg = post.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80";
              return (
                <Card 
                  key={post.id} 
                  className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl overflow-hidden hover:border-[#BD20D3]/40 transition-all duration-300 flex flex-col group h-full"
                >
                  <div className="h-48 overflow-hidden relative bg-black/40 border-b border-white/5">
                    <img 
                      src={displayImg} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <CardHeader className="pt-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-[#BD20D3]" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#1A4BFF]" />
                        {new Date(post.published_at).toLocaleDateString('sk-SK')}
                      </span>
                    </div>

                    <CardTitle className="text-xl font-bold text-white group-hover:text-[#BD20D3] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <div className="p-6 pt-0 border-t border-white/5 mt-4">
                    <Link to={`/blog/${post.id}`}>
                      <Button className="w-full bg-white/5 hover:bg-[#BD20D3]/15 text-white border border-white/10 rounded-xl transition-colors font-bold h-11 flex items-center justify-center gap-1">
                        <span>Prečítať článok</span>
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Blog;