"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { equipmentService } from '@/lib/equipmentService';
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
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { equipment, loading, addEquipment, updateEquipment, deleteEquipment, refetch } = useEquipment();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [localOrder, setLocalOrder] = useState<EquipmentItem[]>([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  // Drag & Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    setLocalOrder([...equipment]);
  }, [equipment]);

  // Auto-scroll when dragging near edges
  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) return;
    
    scrollIntervalRef.current = setInterval(() => {
      const scrollContainer = document.documentElement;
      if (direction === 'up') {
        scrollContainer.scrollTop -= 10;
      } else {
        scrollContainer.scrollTop += 10;
      }
    }, 30);
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

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Create custom drag image
    const row = (e.target as HTMLElement).closest('tr');
    if (row) {
      const dragImage = row.cloneNode(true) as HTMLElement;
      dragImage.style.width = `${row.offsetWidth}px`;
      dragImage.style.opacity = '0.8';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragPosition(null);
    stopAutoScroll();
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
      
      // Check if near top or bottom of viewport for auto-scroll
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const navbarHeight = 80; // Approximate navbar height
      
      if (rect.top < navbarHeight + 50) {
        startAutoScroll('up');
      } else if (rect.bottom > viewportHeight - 100) {
        startAutoScroll('down');
      } else {
        stopAutoScroll();
      }
    }
  };

  const handleDragLeave = () => {
    // Don't clear dragOverIndex here to prevent flickering
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    stopAutoScroll();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...localOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setLocalOrder(newOrder);
    setHasOrderChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag over the table itself (for empty areas)
  const handleTableDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Check for auto-scroll
    const scrollContainer = document.documentElement;
    const rect = tableRef.current?.getBoundingClientRect();
    
    if (rect) {
      const navbarHeight = 80;
      if (rect.top < navbarHeight + 50) {
        startAutoScroll('up');
      } else if (rect.bottom > window.innerHeight - 100) {
        startAutoScroll('down');
      } else {
        stopAutoScroll();
      }
    }
  };

  const handleSaveOrder = async () => {
    const updates = localOrder.map((item, index) => ({
      id: item.id,
      order_index: index
    }));

    const success = await equipmentService.updateOrder(updates);
    if (success) {
      toast.success('Poradie bolo úspešne uložené!');
      setHasOrderChanges(false);
      refetch();
    } else {
      toast.error('Chyba pri ukladaní poradia.');
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
                  Spravujte ponoku svojej techniky, pridávajte nové kusy a aktualizujte ceny.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
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
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                  }}
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
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingItem(null);
                      }}
                      className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 px-6"
                    >
                      Zrušiť
                    </Button>
                    <Button
                      type="submit"
                      className="btn-cyber rounded-xl h-12 px-8 border-none"
                    >
                      <Save size={18} className="mr-2" />
                      {editingItem ? 'Uložiť zmeny' : 'Uložiť produkt'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <Card className="bg-[#020721]/60 border border-white/10 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/10 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Zoznam všetkých produktov ({localOrder.length})
                  </CardTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    Pretiahnite produkt myšou pre zmenu poradia. Stránka sa automaticky posunie pri okrajoch.
                  </p>
                </div>
                {hasOrderChanges && (
                  <Button
                    onClick={handleSaveOrder}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-5"
                  >
                    <Save size={16} className="mr-2" />
                    Uložiť poradie
                  </Button>
                )}
              </CardHeader>
              
              {loading ? (
                <div className="text-center py-12 text-gray-400">Načítavam...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table 
                    ref={tableRef}
                    className="w-full text-left border-collapse"
                    onDragOver={handleTableDragOver}
                  >
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
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`
                              hover:bg-white/2 transition-all duration-200 cursor-move
                              ${isDragged ? 'opacity-30 scale-95 bg-[#BD20D3]/5' : ''}
                              ${isDragOver && draggedIndex !== null && draggedIndex > index ? 'border-t-2 border-t-[#BD20D3] pt-2' : ''}
                              ${isDragOver && draggedIndex !== null && draggedIndex < index ? 'border-b-2 border-b-[#BD20D3] pb-2' : ''}
                            `}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center text-gray-500 hover:text-[#BD20D3] transition-colors">
                                <GripVertical size={18} />
                              </div>
                            </td>
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
                                  className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 text-white border border-[#BD20D3]/40 rounded-lg h-9 px-3 gap-1.5"
                                  title="Upraviť"
                                >
                                  <Edit size={14} />
                                  <span className="hidden sm:inline">Upraviť</span>
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
                      {localOrder.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                            V databáze nie sú žiadne produkty. Pridajte prvý pomocou tlačidla vyššie.
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