const packageHasInstall = packageItems.some(p => p.install === 'install' || p.install === 'install_uninstall');
  const packageHasInstallUninstall = packageItems.some(p => p.install === 'install_uninstall');
  const packageHasDelivery = packageItems.some(p => p.arrival !== null);

  const packageInstallTotal = packageItems.reduce((sum, p) => sum + p.installPrice, 0);
  const packageDeliveryTotal = packageItems.reduce((sum, p) => sum + p.deliveryPrice, 0);

  const getPackageTotal = (pkg: PackageCartItem) => {
    let total = pkg.price;
    total += pkg.installPrice;
    total += pkg.deliveryPrice;
    const extrasSum = pkg.extras.reduce((sum, e) => sum + e.pricePerDay * e.quantity, 0);
    total += extrasSum;
    return total;
  };