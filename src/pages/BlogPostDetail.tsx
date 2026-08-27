"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { absoluteUrl, absoluteAsset, clipMeta } from '@/lib/site';
import SeoHead from '@/components/SeoHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogService, BlogPost, BlogBlock } from '@/lib/blogService';
import { ChevronLeft, User, Calendar, BookOpen } from 'lucide-react';

const BlogPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedBlocks, setParsedBlocks] = useState<BlogBlock[]>([]);

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
            setParsedBlocks([{ type: 'paragraph', value: data.content }]);
          }
        } catch (e) {
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
        <SeoHead
          path="/blog"
          title="Článok nenájdený | Socializea Audio"
          description="Hľadaný článok neexistuje alebo bol odstránený. Pozrite blog Socializea Audio."
          noindex
        />
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

  const postTitle = `${post.title} | Socializea Audio Blog`;
  const postDescription = clipMeta(
    post.excerpt,
    `${post.title}. Článok na blogu Socializea Audio o ozvučení a svetelnej technike.`
  );

  return (
    <>
      <Helmet>
        <title>{postTitle}</title>
        <meta name="description" content={postDescription} />
        <meta name="keywords" content="blog audio technika, rady ozvučenie, tipy svetelná show, DJ technika blog, svadobné ozvučenie, event technika" />
        <link rel="canonical" href={absoluteUrl(`/blog/${post.id}`)} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={absoluteUrl(`/blog/${post.id}`)} />
        <meta property="og:image" content={post.image || absoluteAsset('/logo.png')} />
        <meta property="og:locale" content="sk_SK" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={post.image || absoluteAsset('/logo.png')} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": postDescription,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "datePublished": post.published_at,
            "url": absoluteUrl(`/blog/${post.id}`),
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />

        <article className="pt-32 pb-16 md:pb-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#BD20D3] hover:underline text-sm font-semibold">
              <ChevronLeft size={16} />
              <span>Návrat na všetky články</span>
            </Link>

            <div className="space-y-4 border-b border-white/10 pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
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

            {post.image && (
              <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

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
                      <h2 key={index} className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight pt-6 border-l-2 border-[#BD20D3] pl-4">
                        {block.value}
                      </h2>
                    );
                  case 'image':
                    return (
                      <div key={index} className="rounded-2xl overflow-hidden border border-white/5 bg-black/30 my-8 shadow-xl">
                        <img 
                          src={block.value} 
                          alt={`${post.title} – ilustrácia`} 
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
    </>
  );
};

export default BlogPostDetail;