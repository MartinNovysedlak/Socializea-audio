"use client";

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  RefreshCw,
  Settings,
  Package,
  ShoppingBag,
  FileText,
  Lightbulb,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEquipment } from '@/hooks/useEquipment';
import { useToast } from '@/hooks/use-toast';
import DynamicBubbleInput from '@/components/DynamicBubbleInput';
import ImageManager from '@/components/ImageManager';
import { packagesService, PackageData } from '@/lib/packagesService';
import { blogService, BlogPost } from '@/lib/blogService';
import { salesService, SalesItem } from '@/lib/salesService';
import { faqService, FAQItem } from '@/lib/faqService';
import { equipmentService } from '@/lib/equipmentService';

const Admin = () => {
  // Equipment state
  const { equipment, loading, addEquipment, updateEquipment, deleteEquipment, refetch } = useEquipment();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Package form state
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    price_no_lights: 0,
    price_with_lights: 0,
    description: '',
    sound_specs: [] as string[],
    light_specs: [] as string[],
    other_specs: [] as string[],
    warning: '',
    images: [] as string[],
  });

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [faqFormData, setFaqFormData] = useState({ question: '', answer: '' });
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);

  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
  });
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [blogBlocks, setBlogBlocks] = useState<{ type: 'paragraph' | 'heading' | 'image'; value: string }[]>([]);

  // Sales state
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [salesFormData, setSalesFormData] = useState({
    name: '',
    price: 0,
    condition: 'new' as 'new' | 'used',
    description: '',
    images: [] as string[],
    specs: [] as string[],
    features: [] as string[],
    available: true,
  });
  const [editingSales, setEditingSales] = useState<string | null>(null);
  const [isSalesFormOpen, setIsSalesFormOpen] = useState(false);

  // Equipment form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'sound' as 'sound' | 'lighting' | 'other',
    pricePerDay: 0,
    available: 1,
    description: '',
    mainImage: '',
    images: [] as string[],
    specifications: [] as string[],
    features: [] as string[],
  });

  const [activeTab, setActiveTab] = useState('equipment');

  // Fetch packages on mount
  const fetchPackages = async () => {
    setLoadingPackages(true);
    const data = await packagesService.getAll();
    setPackages(data);
    setLoadingPackages(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoadingFaqs(true);
    const data = await faqService.getAll();
    setFaqs(data);
    setLoadingFaqs(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoadingBlog(true);
    const data = await blogService.getAll();
    setBlogPosts(data);
    setLoadingBlog(false);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Fetch sales items
  const fetchSalesItems = async () => {
    setLoadingSales(true);
    const data = await salesService.getAll();
    setSalesItems(data);
    setLoadingSales(false);
  };

  useEffect(() => {
    fetchSalesItems();
  }, []);

  // Package form handlers
  const resetPackageForm = () => {
    setPackageFormData({
      name: '',
      price_no_lights: 0,
      price_with_lights: 0,
      description: '',
      sound_specs: [],
      light_specs: [],
      other_specs: [],
      warning: '',
      images: [],
    });
    setEditingPackage(null);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageFormData.name.trim()) {
      toast.error('Zadajte názov balíka!');
      return;
    }

    try {
      if (editingPackage) {
        const result = await packagesService.update(editingPackage, {
          name: packageFormData.name,
          price_no_lights: packageFormData.price_no_lights,
          price_with_lights: packageFormData.price_with_lights,
          description: packageFormData.description,
          sound_specs: packageFormData.sound_specs,
          light_specs: packageFormData.light_specs,
          other_specs: packageFormData.other_specs,
          warning: packageFormData.warning,
          images: packageFormData.images,
        });
        if (result) {
          toast.success('Balík bol úspešne aktualizovaný!');
        } else {
          toast.error('Nepodarilo sa aktualizovať balík.');
        }
      } else {
        const result = await packagesService.create({
          name: packageFormData.name,
          price_no_lights: packageFormData.price_no_lights,
          price_with_lights: packageFormData.price_with_lights,
          description: packageFormData.description,
          sound_specs: packageFormData.sound_specs,
          light_specs: packageFormData.light_specs,
          other_specs: packageFormData.other_specs,
          warning: packageFormData.warning,
          images: packageFormData.images,
        });
        if (result) {
          toast.success('Balík bol úspešne vytvorený!');
        } else {
          toast.error('Nepodarilo sa vytvoriť balík.');
        }
      }
      setIsPackageFormOpen(false);
      resetPackageForm();
      fetchPackages();
    } catch (err) {
      console.error('Package submit error:', err);
      toast.error('Chyba pri ukladaní balíka.');
    }
  };

  const handlePackageEdit = (pkg: PackageData) => {
    setPackageFormData({
      name: pkg.name,
      price_no_lights: pkg.price_no_lights,
      price_with_lights: pkg.price_with_lights,
      description: pkg.description,
      sound_specs: pkg.sound_specs || [],
      light_specs: pkg.light_specs || [],
      other_specs: pkg.other_specs || [],
      warning: pkg.warning || '',
      images: pkg.images || [],
    });
    setEditingPackage(pkg.id);
    setIsPackageFormOpen(true);
  };

  const handlePackageDelete = async (id: string) => {
    if (!confirm('Naozaj chcete odstrániť tento balík?')) return;
    const success = await packagesService.delete(id);
    if (success) {
      toast.success('Balík odstránený.');
      fetchPackages();
    } else {
      toast.error('Nepodarilo sa odstrániť balík.');
    }
  };

  // ... (rest of the Admin component functions remain the same)

  return (
    <>
      <Helmet>
        <title>Administrácia | Socializea Audio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="pt-28 pb-16 container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="bg-white/5 border border-white/10 rounded-2xl p-1.5 mb-8 w-full flex-wrap">
              <TabsTrigger value="equipment" className="data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-medium">
                <Settings size={16} className="mr-2" /> Aparatúra
              </TabsTrigger>
              <TabsTrigger value="packages" className="data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-medium">
                <Package size={16} className="mr-2" /> Balíky
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-medium">
                <ShoppingBag size={16} className="mr-2" /> Predaj
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-medium">
                <BookOpen size={16} className="mr-2" /> Blog
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white rounded-xl px-4 py-2 text-sm font-medium">
                <HelpCircle size={16} className="mr-2" /> FAQ
              </TabsTrigger>
            </TabsList>

            {/* Packages tab */}
            <TabsContent value="packages" className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border-white/10 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 px-6 py-6">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-white">Správa balíkov</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">Pridávajte, upravujte a odstraňujte balíky aparatúry.</p>
                  </div>
                  <Dialog open={isPackageFormOpen} onOpenChange={(open) => { setIsPackageFormOpen(open); if (!open) resetPackageForm(); }}>
                    <DialogTrigger asChild>
                      <Button className="btn-cyber rounded-xl h-12 px-6 border-none shrink-0">
                        <Plus size={18} className="mr-2" /> Nový balík
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                          {editingPackage ? 'Upraviť balík' : 'Nový balík'}
                        </DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handlePackageSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Názov balíka *</Label>
                            <Input type="text" value={packageFormData.name} onChange={(e) => setPackageFormData(p => ({ ...p, name: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Cena so svetlami (€) *</Label>
                            <Input type="number" min="0" value={packageFormData.price_with_lights} onChange={(e) => setPackageFormData(p => ({ ...p, price_with_lights: Number(e.target.value) }))} className="bg-black/50 border-white/10 text-white rounded-xl h-12" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingPackages ? (
                    <div className="text-center text-gray-500 py-8">Načítavam balíky...</div>
                  ) : packages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Zatiaľ nebol pridaný žiadny balík.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/5">
                            <TableHead className="text-gray-400">Názov balíka</TableHead>
                            <TableHead className="text-gray-400">Cena (bez svetiel)</TableHead>
                            <TableHead className="text-gray-400">Cena (so svetlami)</TableHead>
                            <TableHead className="text-gray-400">Fotky</TableHead>
                            <TableHead className="text-gray-400 text-right">Akcie</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {packages.map((pkg) => (
                            <TableRow key={pkg.id} className="border-white/5 hover:bg-white/5">
                              <TableCell className="text-white font-medium">{pkg.name}</TableCell>
                              <TableCell className="text-gray-300">{pkg.price_no_lights} €</TableCell>
                              <TableCell className="text-gray-300">{pkg.price_with_lights} €</TableCell>
                              <TableCell className="text-gray-300">
                                <span className="flex items-center gap-1">
                                  <Lightbulb size={14} className="text-[#BD20D3]" />
                                  {pkg.images?.length || (pkg.image ? 1 : 0)} fotiek
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handlePackageEdit(pkg)} className="text-gray-400 hover:text-white">
                                    <Pencil size={14} />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handlePackageDelete(pkg.id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ tab */}
            <TabsContent value="faq" className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* ... FAQ content unchanged ... */}
            </TabsContent>

            {/* Blog tab */}
            <TabsContent value="blog" className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* ... Blog content unchanged ... */}
            </TabsContent>

            {/* Sales tab */}
            <TabsContent value="sales" className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* ... Sales content unchanged ... */}
            </TabsContent>

            {/* Equipment tab */}
            <TabsContent value="equipment" className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* ... Equipment content unchanged ... */}
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Admin;