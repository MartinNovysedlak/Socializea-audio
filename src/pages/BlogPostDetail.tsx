"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogService, BlogPost, BlogBlock } from '@/lib/blogService';
import { ChevronLeft, User, Calendar, BookOpen } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

const BlogPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedBlocks, setParsedBlocks] = useState<BlogBlock[]>([]);

  usePageMeta(
    post ? `${post.title} – Socializea-audio Blog` : 'Socializea-audio | Blog',
    post ? post.excerpt : undefined
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      const data = await blogService.getById(id);
      setPost(data);
      
      if (data && data.content) {
        try {
          const blocks = JSON.parse(data.content);
          if (Array.isArray(blocks)) {
            setParsedBlocks(blocks);
          } else {
            // Fallback for simple raw string content
            setParsedBlocks([{ type: 'paragraph', value: data.content }]);
          }
        } catch (e) {
          // Content is not JSON, load as single paragraph block
          setParsedBlocks([{ type: 'paragraph', value: data.content }]);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] text-gray-400">
          Načítavam článok...
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-white space-y-4">
          <h2 className="text-2xl font-bold">Článok nebol nájdený</h2>
          <p className="text-gray-400 text-sm">Hľadaný príspevok neexistuje alebo bol odstránený.</p>
          <Link to="/blog">
            <Button className="btn-cyber rounded-xl border-none">Späť na zoznam článkov</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />

      <article className="pt-32 pb-24 container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Back Action */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#BD20D3] hover:underline text-sm font-semibold">
            <ChevronLeft size={16} />
            <span>Návrat na všetky články</span>
          </Link>

          {/* Title Header */}
          <div className="space-y-4 border-b border-white/10 pb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[#BD20D3]" />
                <span className="font-medium text-gray-300">{post.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#1A4BFF]" />
                <span>{new Date(post.published_at).toLocaleDateString('sk-SK')}</span>
              </span>
            </div>
          </div>

          {/* Cover Hero Banner */}
          {post.image && (
            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img 
                src={post.image} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* DYNAMIC ARTICLE RENDERER */}
          <div className="prose prose-invert max-w-none space-y-6 pt-4">
            {parsedBlocks.map((block, index) => {
              switch (block.type) {
                case 'paragraph':
                  return (
                    <p key={index} className="text-gray-300 text-base md:text-lg leading-relaxed font-normal whitespace-pre-wrap">
                      {block.value}
                    </p>
                  );
                case 'heading':
                  return (
                    <h2 key={index} className="text-2xl md:text-3xl font-bold text-white tracking-tight pt-6 border-l-2 border-[#BD20D3] pl-4">
                      {block.value}
                    </h2>
                  );
                case 'image':
                  return (
                    <div key={index} className="rounded-2xl overflow-hidden border border-white/5 bg-black/30 my-8 shadow-xl">
                      <img 
                        src={block.value} 
                        alt="" 
                        className="w-full h-auto max-h-[500px] object-cover mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800";
                        }}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* AUTHOR FOOTNOTE */}
          <div className="border-t border-white/10 pt-8 mt-12 flex items-center gap-4 bg-white/2 p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 flex items-center justify-center text-[#BD20D3]">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Napísal autor</p>
              <p className="text-white font-bold">{post.author}</p>
            </div>
          </div>

        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPostDetail;