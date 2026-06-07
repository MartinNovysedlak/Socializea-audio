"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DynamicBubbleInput from '@/components/DynamicBubbleInput';
import ImageManager from '@/components/ImageManager';
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentItem } from '@/lib/supabase';
import { equipmentService } from '@/lib/equipmentService';
import { salesService, SalesItem } from '@/lib/salesService';
import { blogService, BlogPost, BlogBlock } from '@/lib/blogService';
import { 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  Plus, 
  Edit, 
  Trash2, 
  Volume2, 
  Save, 
  X,
  GripVertical,
  ShoppingBag,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Heading,
  Type
} from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'rentals' | 'sales' | 'blog'>('rentals');

  // --- 1. RENTAL STATE (Existing) ---
  const { equipment, loading: loadingRentals, addEquipment, updateEquipment, deleteEquipment, setEquipment, refetch } = useEquipment();
  const [isRentalFormOpen, setIsRentalFormOpen] = useState(false);
  const [editingRental, setEditingRental] = useState<EquipmentItem | null>(null);
  const [localOrder, setLocalOrder] = useState<EquipmentItem[]>([]);
  const [rentalFormData, setRentalFormData] = useState({
    name: '',
    category: 'sound' as 'sound' | 'lighting' | 'other',
    pricePerDay: 10,
    available: 1,
    description: '',
    images: [] as string[],
    specifications: [] as string[],
    features: [] as string[]
  });

  // Drag & Drop state
  const [canDrag, setCanDrag] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- 2. SALES STATE ---
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [isSalesFormOpen, setIsSalesFormOpen] = useState(false);
  const [editingSales, setEditingSales] = useState<SalesItem | null>(null);
  const [salesFormData, setSalesFormData] = useState({
    name: '',
    price: 99,
    condition: 'new' as 'new' | 'used',
    description: '',
    images: [] as string[],
    specs: [] as string[],
    features: [] as string[],
    available_count: 1,
    available: true
  });

  // --- 3. BLOG STATE ---
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    image: '',
    author: 'Admin Team'
  });
  const [blogBlocks, setBlogBlocks] = useState<BlogBlock[]>([]);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setLocalOrder([...equipment]);
  }, [equipment]);

  // Load Sales and Blog on Auth success
  useEffect(() => {
    if (isAuthenticated) {
      loadSalesData();
      loadBlogData();
    }
  }, [isAuthenticated]);

  const loadSalesData = async () => {
    setLoadingSales(true);
    const data = await salesService.getAll();
    setSalesItems(data);
    setLoadingSales(false);
  };

  const loadBlogData = async () => {
    setLoadingBlog(true);
    const data = await blogService.getAll();
    setBlogPosts(data);
    setLoadingBlog(false);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isRentalFormOpen || isSalesFormOpen || isBlogFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRentalFormOpen, isSalesFormOpen, isBlogFormOpen]);

  // Auto-scroll when dragging near edges
  const checkAndScroll = useCallback((clientY: number) => {
    const viewportHeight = window.innerHeight;
    const topTriggerZone = 110;
    const bottomTriggerZone = viewportHeight - 30;
    
    if (clientY < topTriggerZone) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, -15);
        }, 50);
      }
    } else if (clientY > bottomTriggerZone) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, 15);
        }, 50);
      }
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin_socializea' && password === 'Pondelok-2022') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success('Prihlásenie úspešné!', {
        description: 'Vitajte v administrácii Socializea-audio.',
      });
    } else {
      toast.error('Nesprávne údaje!', {
        description: 'Zadané meno alebo heslo nie je správne.',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    toast.info('Boli ste odhlásený.');
  };

  // --- RENTAL FUNCTIONS ---
  const handleOpenRentalAdd = () => {
    setEditingRental(null);
    setRentalFormData({
      name: '',
      category: 'sound',
      pricePerDay: 10,
      available: 1,
      description: '',
      images: [],
      specifications: [],
      features: []
    });
    setIsRentalFormOpen(true);
  };

  const handleOpenRentalEdit = (item: EquipmentItem) => {
    setEditingRental(item);
    setRentalFormData({
      name: item.name,
      category: item.category,
      pricePerDay: item.price_per_day,
      available: item.available,
      description: item.description || '',
      images: item.images || [],
      specifications: item.specifications || [],
      features: item.features || []
    });
    setIsRentalFormOpen(true);
  };

  const handleDeleteRental = async (id: string, name: string) => {
    if (window.confirm(`Naozaj chcete vymazať produkt na prenájom: "${name}"?`)) {
      const success = await deleteEquipment(id);
      if (success) {
        toast.success('Produkt úspešne vymazaný.');
      } else {
        toast.error('Chyba pri mazaní produktu.');
      }
    }
  };

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalFormData.name.trim() || !rentalFormData.description.trim()) {
      toast.error('Vyplňte povinné polia!');
      return;
    }

    const mainImage = rentalFormData.images[0] || '';

    const itemData = {
      name: rentalFormData.name.trim(),
      category: rentalFormData.category,
      pricePerDay: Number(rentalFormData.pricePerDay),
      available: Number(rentalFormData.available),
      description: rentalFormData.description.trim(),
      mainImage: mainImage,
      images: rentalFormData.images,
      specifications: rentalFormData.specifications,
      features: rentalFormData.features
    };

    if (editingRental) {
      const updated = await updateEquipment(editingRental.id, itemData);
      if (updated) {
        toast.success('Produkt na prenájom bol upravený!');
        setIsRentalFormOpen(false);
        setEditingRental(null);
      } else {
        toast.error('Chyba pri úprave produktu.');
      }
    } else {
      const newItem = await addEquipment(itemData);
      if (newItem) {
        toast.success('Nový produkt bol úspešne pridaný!');
        setIsRentalFormOpen(false);
      } else {
        toast.error('Chyba pri pridávaní produktu.');
      }
    }
  };

  // Drag & Drop handlers for Rentals
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
    setCanDrag(false);
    stopAutoScroll();
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
      const row = (e.target as HTMLElement).closest('tr');
      if (row) {
        const rect = row.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        setDropPosition(e.clientY < midY ? 'above' : 'below');
      }
      checkAndScroll(e.clientY);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    stopAutoScroll();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    let finalDropIndex = dropIndex;
    if (dropPosition === 'below') finalDropIndex = dropIndex + 1;
    if (draggedIndex < finalDropIndex) finalDropIndex = finalDropIndex - 1;

    const newOrder = [...localOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(finalDropIndex, 0, draggedItem);
    
    setLocalOrder(newOrder);
    setEquipment(newOrder);
    handleDragEnd();

    const updates = newOrder.map((item, idx) => ({ id: item.id, order_index: idx }));
    const success = await equipmentService.updateOrder(updates);
    if (success) {
      toast.success('Poradie úspešne uložené!');
    } else {
      toast.error('Nepodarilo sa uložiť poradie.');
    }
  };

  // --- SALES FUNCTIONS ---
  const handleOpenSalesAdd = () => {
    setEditingSales(null);
    setSalesFormData({
      name: '',
      price: 100,
      condition: 'new',
      description: '',
      images: [],
      specs: [],
      features: [],
      available_count: 1,
      available: true
    });
    setIsSalesFormOpen(true);
  };

  const handleOpenSalesEdit = (item: SalesItem) => {
    setEditingSales(item);
    setSalesFormData({
      name: item.name,
      price: item.price,
      condition: item.condition,
      description: item.description,
      images: item.images || [],
      specs: item.specs || [],
      features: item.features || [],
      available_count: item.available_count ?? 1,
      available: item.available
    });
    setIsSalesFormOpen(true);
  };

  const handleDeleteSales = async (id: string, name: string) => {
    if (window.confirm(`Naozaj chcete vymazať produkt na predaj: "${name}"?`)) {
      const success = await salesService.delete(id);
      if (success) {
        toast.success('Produkt na predaj úspešne vymazaný.');
        loadSalesData();
      } else {
        toast.error('Chyba pri mazaní.');
      }
    }
  };

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesFormData.name.trim() || !salesFormData.description.trim()) {
      toast.error('Vyplňte názov a popis!');
      return;
    }

    const payload = {
      ...salesFormData,
      available: salesFormData.available_count > 0
    };

    if (editingSales) {
      const updated = await salesService.update(editingSales.id, payload);
      if (updated) {
        toast.success('Produkt na predaj úspešne upravený!');
        setIsSalesFormOpen(false);
        loadSalesData();
      } else {
        toast.error('Chyba pri úprave.');
      }
    } else {
      const created = await salesService.create(payload);
      if (created) {
        toast.success('Nový produkt na predaj pridaný!');
        setIsSalesFormOpen(false);
        loadSalesData();
      } else {
        toast.error('Chyba pri pridávaní.');
      }
    }
  };

  // --- BLOG FUNCTIONS ---
  const handleOpenBlogAdd = () => {
    setEditingBlog(null);
    setBlogFormData({
      title: '',
      excerpt: '',
      image: '',
      author: 'Admin Team'
    });
    setBlogBlocks([
      { type: 'paragraph', value: '' }
    ]);
    setIsBlogFormOpen(true);
  };

  const handleOpenBlogEdit = (post: BlogPost) => {
    setEditingBlog(post);
    setBlogFormData({
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      author: post.author
    });
    
    // Parse JSON block list from database content field
    try {
      const parsed = JSON.parse(post.content);
      if (Array.isArray(parsed)) {
        setBlogBlocks(parsed);
      } else {
        setBlogBlocks([{ type: 'paragraph', value: post.content }]);
      }
    } catch (e) {
      setBlogBlocks([{ type: 'paragraph', value: post.content }]);
    }
    
    setIsBlogFormOpen(true);
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (window.confirm(`Naozaj chcete vymazať článok: "${title}"?`)) {
      const success = await blogService.delete(id);
      if (success) {
        toast.success('Článok bol vymazaný.');
        loadBlogData();
      } else {
        toast.error('Chyba pri mazaní.');
      }
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.title.trim() || !blogFormData.excerpt.trim()) {
      toast.error('Vyplňte názov a úvod článku!');
      return;
    }

    // Convert block content array to string format
    const contentPayload = JSON.stringify(blogBlocks.filter(b => b.value.trim() !== ''));

    const payload = {
      title: blogFormData.title.trim(),
      excerpt: blogFormData.excerpt.trim(),
      content: contentPayload,
      image: blogFormData.image || blogBlocks.find(b => b.type === 'image')?.value || '',
      author: blogFormData.author.trim()
    };

    if (editingBlog) {
      const updated = await blogService.update(editingBlog.id, payload);
      if (updated) {
        toast.success('Článok bol úspešne upravený!');
        setIsBlogFormOpen(false);
        loadBlogData();
      } else {
        toast.error('Chyba pri úprave.');
      }
    } else {
      const created = await blogService.create(payload);
      if (created) {
        toast.success('Nový článok bol úspešne uverejnený!');
        setIsBlogFormOpen(false);
        loadBlogData();
      } else {
        toast.error('Chyba pri uverejňovaní.');
      }
    }
  };

  // Block management inside blog form
  const addBlock = (type: 'paragraph' | 'heading' | 'image') => {
    setBlogBlocks(prev => [...prev, { type, value: '' }]);
  };

  const removeBlock = (index: number) => {
    setBlogBlocks(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateBlockValue = (index: number, val: string) => {
    setBlogBlocks(prev => prev.map((block, idx) => idx === index ? { ...block, value: val } : block));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blogBlocks.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blogBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlogBlocks(updated);
  };

  const handleBlockImageUpload = async (index: number, file: File) => {
    const toastId = toast.loading('Nahrávam obrázok do bloku...');
    const url = await equipmentService.uploadImage(file);
    toast.dismiss(toastId);
    if (url) {
      updateBlockValue(index, url);
      toast.success('Obrázok nahraný.');
    } else {
      toast.error('Chyba pri nahrávaní.');
    }
  };

  return (
    <main className="min-h-screen bg-[#020721] flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow pt-40 pb-24 container mx-auto px-4">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-full max-w-md">
              <Card className="bg-[#020721]/90 border border-[#BD20D3]/30 shadow-2xl shadow-[#BD20D3]/10 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]" />
                
                <CardHeader className="text-center pt-8">
                  <div className="w-14 h-14 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#BD20D3]">
                    <Lock size={28} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">Chránená sekcia</CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Pre prístup do administrácie sa musíte prihlásiť.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Prihlasovacie meno</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Zadajte meno"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3] focus:border-[#BD20D3]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Heslo</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3] focus:border-[#BD20D3]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full btn-cyber h-12 rounded-xl text-base font-bold border-none mt-4">
                      Prihlásiť sa
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* ADMIN NAV/HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#020721]/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="text-[#BD20D3]" size={32} />
                  <h1 className="text-3xl font-extrabold text-white">Administrácia systému</h1>
                </div>
                <p className="text-gray-400 mt-1">
                  Kompletná správa produktov na prenájom, techniky na predaj a firemného blogu.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white rounded-xl h-11 px-5 transition-all"
                >
                  <LogOut size={18} className="mr-2" />
                  Odhlásiť sa
                </Button>
              </div>
            </div>

            {/* TAB CONTROLLERS */}
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="space-y-6">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl inline-flex w-auto">
                <TabsTrigger value="rentals" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
                  <Volume2 size={14} />
                  <span className="hidden sm:inline">Prenájom</span>
                  <span className="sm:hidden">Prenájom</span>
                </TabsTrigger>
                <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
                  <ShoppingBag size={14} />
                  <span className="hidden sm:inline">Predaj</span>
                  <span className="sm:hidden">Predaj</span>
                </TabsTrigger>
                <TabsTrigger value="blog" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
                  <BookOpen size={14} />
                  <span className="hidden sm:inline">Blog</span>
                  <span className="sm:hidden">Blog</span>
                </TabsTrigger>
              </TabsList>

              {/* RENTALS TAB PANEL */}
              <TabsContent value="rentals" className="space-y-6">
                <div className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Správa inventára pre prenájom aparatúry</span>
                  <Button onClick={handleOpenRentalAdd} className="btn-cyber rounded-xl h-10 px-5 border-none">
                    <Plus size={16} className="mr-1.5" /> Pridať na prenájom
                  </Button>
                </div>

                <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
                  {loadingRentals ? (
                    <div className="text-center py-12 text-gray-400">Načítavam prenájmy...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" onDragOver={(e) => e.preventDefault()}>
                        <thead>
                          <tr className="border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/2">
                            <th className="px-4 py-4 w-16 text-center"></th>
                            <th className="px-6 py-4">Obrázok</th>
                            <th className="px-6 py-4">Názov</th>
                            <th className="px-6 py-4">Kategória</th>
                            <th className="px-6 py-4 text-center">Cena / deň</th>
                            <th className="px-6 py-4 text-center">Kusy</th>
                            <th className="px-6 py-4 text-right">Akcie</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                          {localOrder.map((item, index) => {
                            const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                            const isDragged = draggedIndex === index;
                            const isDragOver = dragOverIndex === index;
                            return (
                              <tr 
                                key={item.id}
                                draggable={canDrag}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`row-transition ${isDragged ? 'opacity-40 bg-[#BD20D3]/10' : 'hover:bg-white/2'}`}
                              >
                                <td 
                                  className="px-4 py-4 cursor-grab active:cursor-grabbing text-center"
                                  onMouseDown={() => setCanDrag(true)}
                                  onMouseUp={() => setCanDrag(false)}
                                >
                                  <GripVertical size={16} className="text-gray-500 mx-auto" />
                                </td>
                                <td className="px-6 py-4">
                                  <img src={displayImg} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                </td>
                                <td className="px-6 py-4 font-semibold text-white max-w-[240px] truncate">{item.name}</td>
                                <td className="px-6 py-4 capitalize">{item.category === 'sound' ? 'Zvuk' : item.category === 'lighting' ? 'Svetlá' : 'Ostatné'}</td>
                                <td className="px-6 py-4 text-center font-bold text-[#BD20D3]">{item.price_per_day} €</td>
                                <td className="px-6 py-4 text-center">{item.available}</td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button onClick={() => handleOpenRentalEdit(item)} size="sm" className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 text-white rounded-lg h-8 px-2.5">
                                      <Edit size={12} />
                                    </Button>
                                    <Button onClick={() => handleDeleteRental(item.id, item.name)} size="sm" variant="outline" className="border-white/10 hover:border-red-500 text-red-400 rounded-lg h-8 w-8 p-0">
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* SALES TAB PANEL */}
              <TabsContent value="sales" className="space-y-6">
                <div className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Správa produktov určených na priamy predaj</span>
                  <Button onClick={handleOpenSalesAdd} className="btn-cyber rounded-xl h-10 px-5 border-none">
                    <Plus size={16} className="mr-1.5" /> Pridať na predaj
                  </Button>
                </div>

                <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
                  {loadingSales ? (
                    <div className="text-center py-12 text-gray-400">Načítavam predaje...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/2">
                            <th className="px-6 py-4">Obrázok</th>
                            <th className="px-6 py-4">Názov</th>
                            <th className="px-6 py-4">Stav</th>
                            <th className="px-6 py-4 text-center">Dostupný</th>
                            <th className="px-6 py-4 text-center">Kusov na predaj</th>
                            <th className="px-6 py-4 text-center">Predajná cena</th>
                            <th className="px-6 py-4 text-right">Akcie</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                          {salesItems.map((item) => {
                            const img = item.images?.[0] || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                            return (
                              <tr key={item.id} className="hover:bg-white/2">
                                <td className="px-6 py-4">
                                  <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                </td>
                                <td className="px-6 py-4 font-semibold text-white max-w-[280px] truncate">{item.name}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.condition === 'new' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {item.condition === 'new' ? 'Nový' : 'Bazár'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={item.available_count > 0 ? "text-emerald-400" : "text-red-400"}>
                                    {item.available_count > 0 ? "Skladom" : "Vypredané"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">{item.available_count} ks</td>
                                <td className="px-6 py-4 text-center font-bold text-[#BD20D3]">{item.price} €</td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button onClick={() => handleOpenSalesEdit(item)} size="sm" className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 text-white rounded-lg h-8 px-2.5">
                                      <Edit size={12} />
                                    </Button>
                                    <Button onClick={() => handleDeleteSales(item.id, item.name)} size="sm" variant="outline" className="border-white/10 hover:border-red-500 text-red-400 rounded-lg h-8 w-8 p-0">
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {salesItems.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-gray-500 italic">Žiadna technika na predaj.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* BLOG TAB PANEL */}
              <TabsContent value="blog" className="space-y-6">
                <div className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Správa firemných článkov a noviniek</span>
                  <Button onClick={handleOpenBlogAdd} className="btn-cyber rounded-xl h-10 px-5 border-none">
                    <Plus size={16} className="mr-1.5" /> Pridať článok
                  </Button>
                </div>

                <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
                  {loadingBlog ? (
                    <div className="text-center py-12 text-gray-400">Načítavam články...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/2">
                            <th className="px-6 py-4">Obrázok</th>
                            <th className="px-6 py-4">Názov článku</th>
                            <th className="px-6 py-4">Autor</th>
                            <th className="px-6 py-4">Dátum publikovania</th>
                            <th className="px-6 py-4 text-right">Akcie</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                          {blogPosts.map((post) => {
                            return (
                              <tr key={post.id} className="hover:bg-white/2">
                                <td className="px-6 py-4">
                                  <img src={post.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"} alt="" className="w-12 h-10 rounded object-cover border border-white/10" />
                                </td>
                                <td className="px-6 py-4 font-semibold text-white max-w-[320px] truncate">{post.title}</td>
                                <td className="px-6 py-4 text-gray-400">{post.author}</td>
                                <td className="px-6 py-4 text-xs text-gray-400">
                                  {new Date(post.published_at).toLocaleDateString('sk-SK')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button onClick={() => handleOpenBlogEdit(post)} size="sm" className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 text-white rounded-lg h-8 px-2.5">
                                      <Edit size={12} />
                                    </Button>
                                    <Button onClick={() => handleDeleteBlog(post.id, post.title)} size="sm" variant="outline" className="border-white/10 hover:border-red-500 text-red-400 rounded-lg h-8 w-8 p-0">
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {blogPosts.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-gray-500 italic">Žiadne články v blogu.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* --- RENTALS POP-UP MODAL --- */}
      {isRentalFormOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button onClick={() => { setIsRentalFormOpen(false); setEditingRental(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  {editingRental ? <Edit size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingRental ? 'Upraviť prenájom' : 'Nový produkt na prenájom'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleRentalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Názov produktu *</Label>
                    <Input type="text" value={rentalFormData.name} onChange={(e) => setRentalFormData(p => ({ ...p, name: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Kategória</Label>
                    <select value={rentalFormData.category} onChange={(e) => setRentalFormData(p => ({ ...p, category: e.target.value as any }))} className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#BD20D3] focus:outline-none">
                      <option value="sound">Zvuk</option>
                      <option value="lighting">Svetlá a efekty</option>
                      <option value="other">Ostatné</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cena za deň (€) *</Label>
                    <Input type="number" min="1" value={rentalFormData.pricePerDay} onChange={(e) => setRentalFormData(p => ({ ...p, pricePerDay: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Počet kusov skladom *</Label>
                    <Input type="number" min="1" value={rentalFormData.available} onChange={(e) => setRentalFormData(p => ({ ...p, available: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Popis produktu *</Label>
                  <Textarea value={rentalFormData.description} onChange={(e) => setRentalFormData(p => ({ ...p, description: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl min-h-[100px]" required />
                </div>

                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                  <ImageManager images={rentalFormData.images} onChange={(images) => setRentalFormData(p => ({ ...p, images }))} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DynamicBubbleInput label="Technické parametre" placeholder="Pridať parameter..." items={rentalFormData.specifications} onChange={(specifications) => setRentalFormData(p => ({ ...p, specifications }))} />
                  <DynamicBubbleInput label="Kľúčové vlastnosti" placeholder="Pridať vlastnosť..." items={rentalFormData.features} onChange={(features) => setRentalFormData(p => ({ ...p, features }))} />
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <Button type="button" variant="outline" onClick={() => { setIsRentalFormOpen(false); setEditingRental(null); }} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6">Zrušiť</Button>
                  <Button type="submit" className="btn-cyber rounded-xl h-12 px-8 border-none"><Save size={18} className="mr-2" /> Uložiť</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* --- SALES POP-UP MODAL --- */}
      {isSalesFormOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button onClick={() => { setIsSalesFormOpen(false); setEditingSales(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingSales ? 'Upraviť produkt na predaj' : 'Pridať produkt na predaj'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSalesSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Názov produktu na predaj *</Label>
                    <Input type="text" value={salesFormData.name} onChange={(e) => setSalesFormData(p => ({ ...p, name: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Stav produktu</Label>
                    <select value={salesFormData.condition} onChange={(e) => setSalesFormData(p => ({ ...p, condition: e.target.value as any }))} className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-12 px-4 focus:ring-1 focus:ring-[#BD20D3] focus:outline-none">
                      <option value="new">Nový kus (Ihneď skladom)</option>
                      <option value="used">B-Stock / Použitý (Rozbalený bazár)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Predajná cena (€) *</Label>
                    <Input type="number" min="1" value={salesFormData.price} onChange={(e) => setSalesFormData(p => ({ ...p, price: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Počet kusov k dispozícii *</Label>
                    <Input type="number" min="0" value={salesFormData.available_count} onChange={(e) => setSalesFormData(p => ({ ...p, available_count: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Detailný popis produktu na predaj *</Label>
                  <Textarea value={salesFormData.description} onChange={(e) => setSalesFormData(p => ({ ...p, description: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl min-h-[100px]" required />
                </div>

                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                  <ImageManager images={salesFormData.images} onChange={(images) => setSalesFormData(p => ({ ...p, images }))} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DynamicBubbleInput label="Technické špecifikácie" placeholder="Napr. Príkon: 500W..." items={salesFormData.specs} onChange={(specs) => setSalesFormData(p => ({ ...p, specs }))} />
                  <DynamicBubbleInput label="Kľúčové vlastnosti" placeholder="Napr. Záruka 3 roky..." items={salesFormData.features} onChange={(features) => setSalesFormData(p => ({ ...p, features }))} />
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <Button type="button" variant="outline" onClick={() => { setIsSalesFormOpen(false); setEditingSales(null); }} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6">Zrušiť</Button>
                  <Button type="submit" className="btn-cyber rounded-xl h-12 px-8 border-none"><Save size={18} className="mr-2" /> Uložiť produkt</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* --- BLOG POP-UP MODAL WITH BLOCK-BASED RICH EDITOR --- */}
      {isBlogFormOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button onClick={() => { setIsBlogFormOpen(false); setEditingBlog(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingBlog ? 'Upraviť článok' : 'Pridať nový článok'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Titulok článku *</Label>
                    <Input type="text" value={blogFormData.title} onChange={(e) => setBlogFormData(p => ({ ...p, title: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Autor článku *</Label>
                    <Input type="text" value={blogFormData.author} onChange={(e) => setBlogFormData(p => ({ ...p, author: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Krátky úvod / Excerpt * (Zobrazuje sa v náhľade)</Label>
                  <Input type="text" value={blogFormData.excerpt} onChange={(e) => setBlogFormData(p => ({ ...p, excerpt: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Hlavný náhľadový obrázok (URL)</Label>
                  <Input type="text" value={blogFormData.image} onChange={(e) => setBlogFormData(p => ({ ...p, image: e.target.value }))} placeholder="https://images.unsplash.com/..." className="bg-black/50 border-white/10 text-white rounded-xl h-12" />
                </div>

                {/* DYNAMIC CONTENT BLOCKS WRAPPER */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-300 text-lg font-bold">Obsah článku (Dynamické bloky)</Label>
                    <span className="text-xs text-gray-500">Pridávajte odseky, nadpisy a nahrávajte fotky priamo medzi text.</span>
                  </div>

                  <div className="space-y-4 bg-black/30 border border-white/10 p-6 rounded-2xl">
                    {blogBlocks.map((block, idx) => (
                      <div key={idx} className="bg-[#020721] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4 group/block">
                        
                        {/* Block type identity icon */}
                        <div className="flex items-center gap-2 md:flex-col md:items-center">
                          <span className="text-xs font-bold text-[#BD20D3] uppercase tracking-wider md:mb-1">
                            #{idx + 1}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                            {block.type === 'paragraph' && <Type size={16} />}
                            {block.type === 'heading' && <Heading size={16} />}
                            {block.type === 'image' && <ImageIcon size={16} />}
                          </div>
                        </div>

                        {/* Editor inputs dependent on type */}
                        <div className="flex-grow w-full space-y-2">
                          {block.type === 'heading' && (
                            <Input 
                              type="text" 
                              value={block.value} 
                              onChange={(e) => updateBlockValue(idx, e.target.value)} 
                              placeholder="Sem zadajte podnadpis..." 
                              className="bg-black/40 border-white/5 font-bold text-white rounded-xl"
                            />
                          )}

                          {block.type === 'paragraph' && (
                            <Textarea 
                              value={block.value} 
                              onChange={(e) => updateBlockValue(idx, e.target.value)} 
                              placeholder="Sem napíšte odsek textu..." 
                              className="bg-black/40 border-white/5 text-gray-300 rounded-xl min-h-[80px]"
                            />
                          )}

                          {block.type === 'image' && (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input 
                                  type="text" 
                                  value={block.value} 
                                  onChange={(e) => updateBlockValue(idx, e.target.value)} 
                                  placeholder="URL adresa obrázka..." 
                                  className="bg-black/40 border-white/5 text-white rounded-xl flex-grow text-xs h-10"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                      const files = (e.target as HTMLInputElement).files;
                                      if (files && files.length > 0) {
                                        handleBlockImageUpload(idx, files[0]);
                                      }
                                    };
                                    input.click();
                                  }}
                                  className="border-[#BD20D3]/30 hover:bg-[#BD20D3]/10 text-white rounded-xl h-10 text-xs px-3 whitespace-nowrap"
                                >
                                  Nahrať fotku
                                </Button>
                              </div>
                              {block.value && (
                                <div className="aspect-video w-full max-w-[200px] rounded-lg overflow-hidden border border-white/10">
                                  <img src={block.value} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Block reorder / actions */}
                        <div className="flex items-center gap-1.5 md:flex-col md:self-stretch md:justify-between self-end shrink-0">
                          <div className="flex gap-1 md:flex-col">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              disabled={idx === 0}
                              onClick={() => moveBlock(idx, 'up')}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <ArrowUp size={14} />
                            </Button>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              disabled={idx === blogBlocks.length - 1}
                              onClick={() => moveBlock(idx, 'down')}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <ArrowDown size={14} />
                            </Button>
                          </div>
                          
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeBlock(idx)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-500/20"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Add Block Triggers */}
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <Button 
                      type="button" 
                      onClick={() => addBlock('paragraph')}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2 text-xs font-semibold gap-1.5 h-10"
                    >
                      <Type size={14} className="text-[#BD20D3]" /> Pridať odsek textu
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => addBlock('heading')}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2 text-xs font-semibold gap-1.5 h-10"
                    >
                      <Heading size={14} className="text-[#1A4BFF]" /> Pridať podnadpis
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => addBlock('image')}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2 text-xs font-semibold gap-1.5 h-10"
                    >
                      <ImageIcon size={14} className="text-emerald-400" /> Vložiť fotku
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <Button type="button" variant="outline" onClick={() => { setIsBlogFormOpen(false); setEditingBlog(null); }} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6">Zrušiť</Button>
                  <Button type="submit" className="btn-cyber rounded-xl h-12 px-8 border-none"><Save size={18} className="mr-2" /> Uverejniť článok</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Admin;