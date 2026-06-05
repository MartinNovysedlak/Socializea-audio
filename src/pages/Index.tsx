import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';

export default function Index() {
  return (
    <main className="min-h-screen bg-[#020721]">
      <ContactForm />
      <ContactMap />
    </main>
  );
}