// ... (všetky ostatné importy a kód zostávajú rovnaké, mením len package časť)

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
    setPackageFormData({
      name: pkg.name,
      price_no_lights: pkg.price_no_lights,
      price_with_lights: pkg.price_with_lights,
      images: pkg.images || [],
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

    const payload = {
      name: packageFormData.name.trim(),
      price_no_lights: Number(packageFormData.price_no_lights),
      price_with_lights: Number(packageFormData.price_with_lights),
      images: packageFormData.images,
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

// ... (zvyšok Admin.tsx ostáva nezmenený)

  {/* --- PACKAGES TAB PANEL – v tabuľke zmena zobrazenia obrázka */}
  {/* ... v riadku tabuľky kde je <img src={pkg.image || ...} ...> zmeniť na: */}
  <td className="px-6 py-4">
    <img 
      src={pkg.images?.[0] || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"} 
      alt={pkg.name} 
      className="w-12 h-10 rounded-lg object-cover border border-white/10" 
    />
  </td>

  {/* --- PACKAGES POP-UP MODAL – zvysenie poctu obrázkov, rovnako ako sales */}
  {/* Sekcia s ImageManager ostáva rovnaka, len popis: */}
  <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
    <Label className="text-gray-300 block mb-3">Obrázky balíka</Label>
    <ImageManager images={packageFormData.images} onChange={(images) => setPackageFormData(p => ({ ...p, images }))} />
  </div>