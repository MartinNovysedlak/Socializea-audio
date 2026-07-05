"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DialogContextType {
  isAnyDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType>({
  isAnyDialogOpen: false,
  setDialogOpen: () => {},
});

export const useDialogContext = () => useContext(DialogContext);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [openCount, setOpenCount] = useState(0);
  const setDialogOpen = useCallback((open: boolean) => {
    setOpenCount(prev => Math.max(0, prev + (open ? 1 : -1)));
  }, []);
  return (
    <DialogContext.Provider value={{ isAnyDialogOpen: openCount > 0, setDialogOpen }}>
      {children}
    </DialogContext.Provider>
  );
};