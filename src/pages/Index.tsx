import React from 'react';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';

const Index = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      {/* ... your existing hero, features, etc. sections ... */}
      
      <ContactForm />
      <ContactMap />
      
      {/* ... rest of your page ... */}
    </main>
  );
};

export default Index;