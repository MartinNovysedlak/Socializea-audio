import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';

const Kontakt = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <ContactForm />
        <ContactMap />
      </div>
      <Footer />
    </>
  );
};

export default Kontakt;