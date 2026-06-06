"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DynamicBubbleInput from '@/components/DynamicBubbleInput';
import ImageManager from '@/components/ImageManager';
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentItem } from '@/lib/supabase';
import { seedEquipmentData } from '@/data/seedEquipment';
import { 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  Plus, 
  Edit, 
  Trash2, 
  Volume2, 
  Lightbulb, 
  Layers, 
  Save, 
  X,
  DatabaseBackup,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const { equipment, loading, addEquipment, updateEquipment, deleteEquipment, refetch } = useEquipment();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'sound' as 'sound' | 'lighting' | 'other',
    pricePerDay: 10,
    available: 1,
    description: '',
    images: [] as string[],
    specifications: [] as string[],
    features: [] as string[]
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
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

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'sound',
      pricePerDay: 10,
      available: 1,
      description: '',
      images: [],
      specifications: [],
      features: []
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: EquipmentItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      pricePerDay: item.price_per_day,
      available: item.available,
      description: item.description || '',
      images: item.images || [],
      specifications: item.specifications || [],
      features: item.features || []
    });
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Naozaj chcete vymazať produkt: "${name}"?`)) {
      const success = await deleteEquipment(id);
      if (success) {
        toast.success('Produkt úspešne vymazaný.');
      } else {
        toast.error('Chyba pri mazaní produktu.');
      }
    }
  };

  const handleSeedDatabase = async () => {
    if (window.confirm(`Chystáte sa importovať ${seedEquipmentData.length} predvolených produktov priamo do Supabase databázy. Chcete pokračovať?`)) {
      setIsSeeding(true);
      const loadingToastId = toast.loading(`Importujem produkty (0/${seedEquipmentData.length})...`);
      
      try {
        let successCount = 0;
        for (let i = 0; i < seedEquipmentData.length; i++) {
          const item = seedEquipmentData[i];
          const newItem = await addEquipment({
            name: item.name,
            category: item.category,
            pricePerDay: item.pricePerDay,
            available: item.available,
            description: item.description,
            images: item.images,
            specifications: item.specifications,
            features: item.features
          });
          
          if (newItem) {
            successCount++;
          }
          
          // Aktualizácia toast statusu
          toast.loading(`Importujem produkty (${successCount}/${seedEquipmentData.length})...`, {
            id: loadingToastId
          });
        }
        
        toast.dismiss(loadingToastId);
        toast.success(`Import dokončený! Úspešne nahraných ${successCount} z ${seedEquipmentData.length} produktov.`);
        refetch();
      } catch (err) {
        toast.dismiss(loadingToastId);
        toast.error("Vyskytla sa chyba počas hromadného importu.");
        console.error(err);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name.trim()) {
      toast.error('Názov produktu je povinný!');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Popis produktu je povinný!');
      return;
    }

    const mainImage = formData.images[0] || '';

    const itemData = {
      name: formData.name.trim(),
      category: formData.category,
      pricePerDay: Number(formData.pricePerDay),
      available: Number(formData.available),
      description: formData.description.trim(),
      mainImage: mainImage,
      images: formData.images,
      specifications: formData.specifications,
      features: formData.features
    };

    if (editingItem) {
      const updated = await updateEquipment(editingItem.id, itemData);
      if (updated) {
        toast.success('Produkt bol úspešne upravený!');
        setIsFormOpen(false);
        setEditingItem(null);
      } else {
        toast.error('Chyba pri úprave produktu.');
      }
    } else {
      const newItem = await addEquipment(itemData);
      if (newItem) {
        toast.success('Nový produkt bol úspešne pridaný do databázy!');
        setIsFormOpen(false);
        setEditingItem(null);
      } else {
        toast.error('Chyba pri pridávaní produktu.');
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sound': return <Volume2 className="text-cyan-400" size={16} />;
      case 'lighting': return <Lightbulb className="text-amber-400" size={16} />;
      default: return <Layers className="text-purple-400" size={16} />;
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#020721]/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="text-[#BD20D3]" size={32} />
                  <h1 className="text-3xl font-extrabold text-white">Správa produktov</h1>
                </div>
                <p className="text-gray-400 mt-1">
                  Spravujte ponuku svojej techniky, pridávajte nové kusy a aktualizujte ceny.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  variant="outline"
                  className="border-[#BD20D3]/40 bg-[#BD20D3]/10 text-white hover:bg-[#BD20D3]/20 rounded-xl h-11 px-5 disabled:opacity-40"
                >
                  {isSeeding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <DatabaseBackup size={18} className="mr-2" />
                  )}
                  Importovať prednastavené
                </Button>

                <Button 
                  onClick={handleOpenAddForm}
                  className="btn-cyber rounded-xl h-11 px-6 border-none"
                >
                  <Plus size={18} className="mr-2" />
                  Pridať produkt
                </Button>

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

            {isFormOpen && (
              <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/30 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/5">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                    {editingItem ? <Edit size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingItem ? 'Upraviť produkt' : 'Pridať nový produkt'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {editingItem ? 'Vykonajte úpravy v nasledujúcich poliach.' : 'Vyplňte informácie o novom produkte pre katalóg.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Názov produktu *</Label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="Napr. Subwoofer DB Technologies"
                        className="bg-black/50 border-white/10 text-white rounded-xl h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Kategória</Label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any }))}
                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-12 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3]"
                      >
                        <option value="sound">Zvuk</option>
                        <option value="lighting">Svetlá a efekty</option>
                        <option value="other">Ostatné</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Cena za deň (€) *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData(p => ({ ...p, pricePerDay: Number(e.target.value) }))}
                        className="bg-black/50 border-white/10 text-white rounded-xl h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Počet kusov skladom *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.available}
                        onChange={(e) => setFormData(p => ({ ...p, available: Number(e.target.value) }))}
                        className="bg-black/50 border-white/10 text-white rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Popis produktu *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                      placeholder="Krátky alebo dlhší opis vlastností..."
                      className="bg-black/50 border-white/10 text-white rounded-xl min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                    <ImageManager
                      images={formData.images}
                      onChange={(images) => setFormData(p => ({ ...p, images }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DynamicBubbleInput
                      label="Technické parametre"
                      placeholder="Napr. Frekvencia: 40 Hz - 200 Hz"
                      items={formData.specifications}
                      onChange={(specifications) => setFormData(p => ({ ...p, specifications }))}
                    />

                    <DynamicBubbleInput
                      label="Kľúčové vlastnosti"
                      placeholder="Napr. Vysoký akustický výkon"
                      items={formData.features}
                      onChange={(features) => setFormData(p => ({ ...p, features }))}
                    />
                  </div>

                  <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                      className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6"
                    >
                      Zrušiť
                    </Button>
                    <Button
                      type="submit"
                      className="btn-cyber rounded-xl h-12 px-8 border-none"
                    >
                      <Save size={18} className="mr-2" />
                      Uložiť produkt
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/10 px-6 py-5">
                <CardTitle className="text-xl font-bold text-white">
                  Zoznam všetkých produktov ({equipment.length})
                </CardTitle>
              </CardHeader>
              
              {loading ? (
                <div className="text-center py-12 text-gray-400">Načítavam...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider bg-white/2">
                        <th className="px-6 py-4">Obrázok</th>
                        <th className="px-6 py-4">Názov</th>
                        <th className="px-6 py-4">Kategória</th>
                        <th className="px-6 py-4 text-center">Cena / deň</th>
                        <th className="px-6 py-4 text-center">Kusy</th>
                        <th className="px-6 py-4 text-right">Akcie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                      {equipment.map((item) => {
                        const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                        return (
                          <tr key={item.id} className="hover:bg-white/2 transition-colors">
                            <td className="px-6 py-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                                <img 
                                  src={displayImg} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-white max-w-[280px] truncate" title={item.name}>
                              {item.name}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(item.category)}
                                <span className="capitalize">
                                  {item.category === 'sound' ? 'Zvuk' : item.category === 'lighting' ? 'Svetlá' : 'Ostatné'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-[#BD20D3]">
                              {item.price_per_day} €
                            </td>
                            <td className="px-6 py-4 text-center">
                              {item.available}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleOpenEditForm(item)}
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 hover:border-[#BD20D3] hover:bg-[#BD20D3]/10 text-white rounded-lg h-9 w-9 p-0"
                                  title="Upraviť"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-lg h-9 w-9 p-0"
                                  title="Vymazať"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {equipment.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                            V databáze nie sú žiadne produkty. Pridajte prvý pomocou tlačidla vyššie, alebo kliknite na tlačidlo "Importovať prednastavené" pre nahratie celej tvojej ponuky!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Admin;