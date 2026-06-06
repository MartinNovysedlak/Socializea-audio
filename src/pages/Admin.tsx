"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, LogOut, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Overenie prihlásenia zo sessionStorage pri načítaní
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

  return (
    <main className="min-h-screen bg-[#020721] flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow pt-40 pb-24 container mx-auto px-4 flex items-center justify-center">
        {!isAuthenticated ? (
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
        ) : (
          <div className="w-full max-w-4xl">
            <Card className="bg-[#020721]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3]" />
              
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6 pt-8 px-8">
                <div>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="text-[#BD20D3]" size={28} />
                    <CardTitle className="text-2xl font-bold text-white">Administrácia</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 mt-1">
                    Vitajte v zabezpečenej zóne.
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white rounded-xl h-11 px-5 transition-all"
                >
                  <LogOut size={18} className="mr-2" />
                  Odhlásiť sa
                </Button>
              </CardHeader>

              <CardContent className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 rounded-full flex items-center justify-center mb-6 text-[#1A4BFF]">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Prázdny admin panel</h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                  Momentálne sa tu nenachádzajú žiadne konfiguračné možnosti. Sekcia bude čoskoro doplnená o správu techniky a rezervácií.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Admin;