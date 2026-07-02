Before the `return` statement, find and delete these three lines:

```typescript
  const hasEquipment = Object.values(quantities).some(qty => qty > 0);

  // Spočítame celkový počet inštalácií a deinštalácií z balíkov
  const packageInstallCount = packageItems.filter(p => p.install === 'install').length;
  const packageInstallUninstallCount = packageItems.filter(p => p.install === 'install_uninstall').length;
```

Then, at the very end of the file, after the closing `);` of the component, verify there is:

```typescript
export default FloatingCart;
```

If missing, add it.

(No other changes needed – the component already defines `hasEquipment` inside the body and uses it correctly, and the `packageInstallCount` / `packageInstallUninstallCount` are unused variables that were accidentally duplicated outside the function scope.)