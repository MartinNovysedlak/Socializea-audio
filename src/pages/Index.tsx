import React, { useState } from 'react';
import FloatingCart from '@/components/FloatingCart';
import PackageDetailDialog from '@/components/PackageDetailDialog';
import type { CartItem } from '@/types/cart';

const Index = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [equipment, setEquipment] = useState<any[]>([]);
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Váš existujúci JSX – upravte podľa potreby
  return (
    <div>
      {/* ... */}
      <PackageDetailDialog
        open={packageDialogOpen}
        onOpenChange={setPackageDialogOpen}
        selectedPackage={selectedPackage}
        onAddToCart={handleAddToCart}
      />
      <FloatingCart
        quantities={quantities}
        setQuantities={setQuantities}
        equipment={equipment}
        cartItems={cartItems}
        onRemoveCartItem={handleRemoveCartItem}
      />
    </div>
  );
};

export default Index;