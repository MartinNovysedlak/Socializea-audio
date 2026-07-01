import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Type,
  Bold,
  Italic,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { Package } from '@/lib/supabase';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'sales' | 'blog' | 'packages'>('rentals');
  
  // --- RENTAL STATE ---
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
  
  // --- SALES STATE ---
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
  
  // --- BLOG STATE ---
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

  // --- NEW: PACKAGE STATE ---
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data, error } = await equipmentService.getAll();
      if (error) console.error('Error fetching equipment:', error);
      setLocalOrder(data || []);
      
      const { data: salesData, error: salesError } = await salesService.getAll();
      if (salesError) console.error('Error fetching sales:', salesError);
      else setSalesItems(salesData || []);
      
      const { data: blogData, error: blogError } = await blogService.getAll();
      if (blogError) console.error('Error fetching blog:', blogError);
      else setBlogPosts(blogData || []);
      
      const { data: packagesData, error: packagesError } = await equipmentService.getPackages();
      if (packagesError) {
        toast.error('Chyba pri načítaní balíkov');
        return;
      }
      setPackages(packagesData || []);
    };
    
    fetchAllData();
  }, []);

  // ... (existing rental functions)

  // --- NEW: PACKAGE FUNCTIONS ---
  const handleOpenPackageAdd = () => {
    setSelectedPackage(null);
    setIsPackageFormOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Opravdu chcete vymazať tento balík?')) {
      const success = await equipmentService.deletePackage(id);
      if (success) {
        toast.success('Balík bol vymazaný!');
        fetchAllData(); // Refresh data
      } else {
        toast.error('Chyba pri mazaní balíka');
      }
    }
  };

  const handleEditPackage = (packageData: Package) => {
    setSelectedPackage(packageData);
    setIsPackageFormOpen(true);
  };

  const handleSavePackage = async () => {
    if (!selectedPackage) return;
    
    const { data, error } = await equipmentService.updatePackage(selectedPackage.id, selectedPackage);
    if (error) {
      toast.error('Chyba pri uľňovaní balíka');
      return;
    }
    
    toast.success('Balík bol uľnený!');
    setIsPackageFormOpen(false);
    setSelectedPackage(null);
    fetchAllData(); // Refresh data
  };

  // ... (existing rental functions)

  return (
    <main className="min-h-screen bg-[#020721] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#020721]/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-[#BD20D3]" size={32} />
              <h1 className="text-3xl font-extrabold text-white">Administrácia systému</h1>
            </div>
            <p className="text-gray-400 mt-1">Kompletná správa produktov na prenájom, techniky na predaj a firemného blogu.</p>
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

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl inline-flex w-auto">
            <TabsTrigger value="rentals" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
              <Volume2 size={14} />
              <span>Prenájom</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
              <ShoppingBag size={14} />
              <span>Predaj</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
              <BookOpen size={14} />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="rounded-lg data-[state=active]:bg-[#BD20D3] data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(189,32,211,0.4)] text-gray-400 hover:text-white font-medium text-xs sm:text-sm h-9 px-3 sm:px-5 gap-1.5 transition-all">
              <PackageIcon size={14} />
              <span>Balíky</span>
            </TabsTrigger>
          </TabsList>

          {/* RENTALS TAB PANEL */}
          <TabsContent value="rentals" className="space-y-6">
            {/* ... (existing rental content) */}
          </TabsContent>

          {/* SALES TAB PANEL */}
          <TabsContent value="sales" className="space-y-6">
            {/* ... (existing sales content) */}
          </TabsContent>

          {/* BLOG TAB PANEL */}
          <TabsContent value="blog" className="space-y-6">
            {/* ... (existing blog content) */}
          </TabsContent>

          {/* NEW: PACKAGES TAB PANEL */}
          <TabsContent value="packages" className="space-y-6">
            <div className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5">
              <span className="text-sm text-gray-400">Správa balíkov pre prenájom a predaj</span>
              <Button onClick={handleOpenPackageAdd} className="btn-cyber rounded-xl h-10 px-5 border-none">
                <Plus size={16} className="mr-1.5" /> Pridať nový balík
              </Button>
            </div>

            <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
              {packages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Žiadne balíky v databáze.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/2">
                        <th className="px-6 py-4">Názov</th>
                        <th className="px-6 py-4">Obrázok</th>
                        <th className="px-6 py-4">Popis</th>
                        <th className="px-6 py-4 text-center">Cena bez svetiel (€)</th>
                        <th className="px-6 py-4 text-center">Cena so svetlami (€)</th>
                        <th className="px-6 py-4 text-right">Akcie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-white/2">
                          <td className="px-6 py-4 font-semibold text-white max-w-[300px] truncate">{pkg.name}</td>
                          <td className="px-6 py-4"><img src={pkg.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" /></td>
                          <td className="px-6 py-4 text-gray-300">{pkg.description}</td>
                          <td className="px-6 py-4 text-center font-bold text-[#BD20D3]">{pkg.price_no_lights} €</td>
                          <td className="px-6 py-4 text-center font-bold text-[#BD20D3]">{pkg.price_with_lights} €</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center gap-2">
                              <Button onClick={() => handleEditPackage(pkg)} size="sm" className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 text-white rounded-lg h-8 px-2.5">
                                <Edit size={12} />
                              </Button>
                              <Button onClick={() => handleDeletePackage(pkg.id)} size="sm" variant="outline" className="border-white/10 hover:border-red-500 text-red-400 rounded-lg h-8 w-8 p-0">
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  );
};

export default Admin;