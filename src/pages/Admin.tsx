"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { packagesService, PackageData } from '@/lib/packagesService';
import { faqService, FAQItem } from '@/lib/faqService';
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
  Type,
  Bold,
  Italic,
  Upload,
  Package,
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'rentals' | 'sales' | 'blog' | 'packages' | 'faqs'>('rentals');

  // --- 1. RENTAL STATE ---
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

  // --- 4. PACKAGES STATE ---
  const [packageItems, setPackageItems] = useState<PackageData[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    price_no_lights: 100,
    price_with_lights: 130,
    images: [] as string[],
    description: '',
    sound_specs: [] as string[],
    light_specs: [] as string[],
    other_specs: [] as string[],
    warning: ''
  });

  // --- 5. FAQ STATE ---
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: ''
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setLocalOrder([...equipment]);
  }, [equipment]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSalesData();
      loadBlogData();
      loadPackages();
      loadFaqs();
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

  const loadPackages = async () => {
    setLoadingPackages(true);
    const data = await packagesService.getAll();
    setPackageItems(data);
    setLoadingPackages(false);
  };

  const loadFaqs = async () => {
    setLoadingFaqs(true);
    const data = await faqService.getAll();
    setFaqItems(data);
    setLoadingFaqs(false);
  };

  useEffect(() => {
    if (isRentalFormOpen || isSalesFormOpen || isBlogFormOpen || isPackageFormOpen || isFaqFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRentalFormOpen, isSalesFormOpen, isBlogFormOpen, isPackageFormOpen, isFaqFormOpen]);

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

  // ... (všetky ostatné funkcie ostávajú rovnaké)

  // --- PACKAGE FUNCTIONS ---
  const handleOpenPackageAdd = () => {
    setEditingPackage(null);
    setPackageFormData({
      name: '',
      price_no_lights: 100,
      price_with_lights: 130,
      images: [],
      description: '',
      sound_specs: [],
      light_specs: [],
      other_specs: [],
      warning: ''
    });
    setIsPackageFormOpen(true);
  };

  const handleOpenPackageEdit = (pkg: PackageData) => {
    setEditingPackage(pkg);
    const existingImages = pkg.image ? [pkg.image] : [];
    setPackageFormData({
      name: pkg.name,
      price_no_lights: pkg.price_no_lights,
      price_with_lights: pkg.price_with_lights,
      images: existingImages,
      description: pkg.description,
      sound_specs: pkg.sound_specs || [],
      light_specs: pkg.light_specs || [],
      other_specs: pkg.other_specs || [],
      warning: pkg.warning || ''
    });
    setIsPackageFormOpen(true);
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (window.confirm(`Naozaj chcete vymazať balík: "${name}"?`)) {
      const success = await packagesService.delete(id);
      if (success) {
        toast.success('Balík úspešne vymazaný.');
        loadPackages();
      } else {
        toast.error('Chyba pri mazaní balíka.');
      }
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageFormData.name.trim()) {
      toast.error('Vyplňte názov balíka!');
      return;
    }

    // 💡 Posielame iba image (prvý obrázok) – databáza nemá stĺpec images
    const payload = {
      name: packageFormData.name.trim(),
      price_no_lights: Number(packageFormData.price_no_lights),
      price_with_lights: Number(packageFormData.price_with_lights),
      image: packageFormData.images[0] || '',
      description: packageFormData.description.trim(),
      sound_specs: packageFormData.sound_specs,
      light_specs: packageFormData.light_specs,
      other_specs: packageFormData.other_specs,
      warning: packageFormData.warning.trim()
    };

    if (editingPackage) {
      const updated = await packagesService.update(editingPackage.id, payload);
      if (updated) {
        toast.success('Balík úspešne upravený!');
        setIsPackageFormOpen(false);
        setEditingPackage(null);
        loadPackages();
      } else {
        toast.error('Chyba pri úprave balíka.');
      }
    } else {
      const created = await packagesService.create(payload);
      if (created) {
        toast.success('Nový balík pridaný!');
        setIsPackageFormOpen(false);
        loadPackages();
      } else {
        toast.error('Chyba pri pridávaní balíka.');
      }
    }
  };

  // ... (FAQ funkcie ostávajú rovnaké)

  return (
    <>

      {/* ... (celý JSX ostáva rovnaký) ... */}

      {/* --- PACKAGES POP-UP MODAL --- */}
      {isPackageFormOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button onClick={() => { setIsPackageFormOpen(false); setEditingPackage(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  {editingPackage ? <Edit size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingPackage ? 'Upraviť balík' : 'Pridať nový balík'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handlePackageSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Názov balíka *</Label>
                    <Input type="text" value={packageFormData.name} onChange={(e) => setPackageFormData(p => ({ ...p, name: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cena bez svetiel (€) *</Label>
                    <Input type="number" min="0" value={packageFormData.price_no_lights} onChange={(e) => setPackageFormData(p => ({ ...p, price_no_lights: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cena so svetlami (€) *</Label>
                    <Input type="number" min="0" value={packageFormData.price_with_lights} onChange={(e) => setPackageFormData(p => ({ ...p, price_with_lights: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Cena bez svetiel (€)</Label>
                    <Input type="number" min="0" value={packageFormData.price_no_lights} onChange={(e) => setPackageFormData(p => ({ ...p, price_no_lights: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Popis balíka</Label>
                  <Textarea value={packageFormData.description} onChange={(e) => setPackageFormData(p => ({ ...p, description: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl min-h-[80px]" />
                </div>

                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                  <Label className="text-gray-300 block mb-3">Obrázok balíka</Label>
                  <ImageManager images={packageFormData.images} onChange={(images) => setPackageFormData(p => ({ ...p, images }))} />
                </div>

                <DynamicBubbleInput label="Zvuková technika (položky)" placeholder="Pridať položku..." items={packageFormData.sound_specs} onChange={(sound_specs) => setPackageFormData(p => ({ ...p, sound_specs }))} />

                <DynamicBubbleInput label="Svetlá a efekty (položky)" placeholder="Pridať položku..." items={packageFormData.light_specs} onChange={(light_specs) => setPackageFormData(p => ({ ...p, light_specs }))} />

                <DynamicBubbleInput label="Ostatné (napr. projekcia)" placeholder="Pridať položku..." items={packageFormData.other_specs} onChange={(other_specs) => setPackageFormData(p => ({ ...p, other_specs }))} />

                <div className="space-y-2">
                  <Label className="text-gray-300">Upozornenie (nepovinné)</Label>
                  <Input type="text" value={packageFormData.warning} onChange={(e) => setPackageFormData(p => ({ ...p, warning: e.target.value }))} placeholder="Napr. Upozornenie k balíku..." className="bg-black/50 border-white/10 text-white rounded-xl h-12" />
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <Button type="button" variant="outline" onClick={() => { setIsPackageFormOpen(false); setEditingPackage(null); }} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6">Zrušiť</Button>
                  <Button type="submit" className="btn-cyber rounded-xl h-12 px-8 border-none"><Save size={18} className="mr-2" /> Uložiť balík</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* ... (FAQ a ostatné modály ostávajú rovnaké) ... */}
    </>
  );
};

export default Admin;