"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import { blogService, BlogPost } from '@/lib/blogService';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';

const Blog = () => {
  usePageMeta(
    'Blog – Socializea-audio | Tipy o ozvučení a svetlách v Žiline, Kysuciach',
    'Prečítajte si odborné články o výbere ozvučenia, svetelnej show a DJ technike. Rady pre svadby, oslavy a akcie v Žiline, Čadci a Kysuciach.'
  );

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
    <main className="min-h-screen bg-[#020721] relative overflow-hidden">
      <Navbar />

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />

      <div className="pt-24 md:pt-32 pb-16 md:pb-24 container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-10 md:mb-16 animate-fade-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs md:text-sm font-medium mb-4 md:mb-6 shadow-[0_0_15px_rgba(189,32,211,0.2)]">
            <BookOpen size={14} />
            <span>Socializea-audio Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Rady, tipy & novinky <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
              zo sveta audio-techniky, DJ techniky a osvetlenia pre akcie v Žiline, Čadci a Kysuciach
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Prečítajte si odborné články o správnom nastavení svetiel, výbere ozvučenia a najnovších trendoch v eventovej technike.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Pripravujem blogové príspevky...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-white/5 border border-white/10 rounded-2xl max-w-5xl mx-auto">
            Žiadne uverejnené články na tejto stránke.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {posts.map((post, index) => {
              const displayImg = post.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80";
              return (
                <ScrollReveal key={post.id} direction="up" delay={index * 0.1}>
                  <Link to={`/blog/${post.id}`} className="block h-full">
                    <Card 
                      className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-[#BD20D3]/40 transition-all duration-300 flex flex-col group h-full cursor-pointer hover:shadow-lg hover:shadow-[#BD20D3]/10 hover:-translate-y-2"
                    >
                      <div className="h-40 md:h-48 overflow-hidden relative bg-black/40 border-b border-white/5">
                        <img 
                          src={displayImg} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      <CardHeader className="pt-4 md:pt-6 px-4 md:px-6">
                        <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3">
                          <span className="flex items-center gap-1">
                            <User size={10} className="text-[#BD20D3]" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="text-[#1A4BFF]" />
                            {new Date(post.published_at).toLocaleDateString('sk-SK')}
                          </span>
                        </div>

                        <CardTitle className="text-base md:text-xl font-bold text-white group-hover:text-[#BD20D3] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-4 md:px-6 flex-grow">
                        <p className="text-gray-400 text-xs md:text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>

                      <div className="p-4 md:p-6 pt-0">
                        <Button className="w-full btn-cyber rounded-xl h-10 md:h-11 border-none font-bold text-xs md:text-sm flex items-center justify-center gap-1 pointer-events-none">
                          <span>Prečítať celý článok</span>
                          <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-[10px] md:text-xs leading-relaxed">
            Vitajte na blogu Socializea-audio – zdroji rád a tipov o prenájme aparatúry, výbere ozvučenia a svetelnej show pre akcie v Žiline, Čadci a regióne Kysuce. Dozviete sa, ako si správne vybrať reproduktory na chatu, aké svetlá sú vhodné na diskotéku, alebo ako nastaviť mixážny pult pre firemný event. Sledujte novinky zo sveta DJ techniky, trendov v stage designe a praktické rady pre každú oslavu.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Blog;