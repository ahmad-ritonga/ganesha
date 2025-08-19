import { ReactNode, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import GaneshaNavbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function PublicLayout({ children, title = 'Ganesha Science Institute', description }: PublicLayoutProps) {
  const [showOptions, setShowOptions] = useState(false);

  const whatsappContacts = [
    { label: 'Admin', number: '+6285853754933' },
    { label: 'Admin 2', number: '+6285731039058' }
  ];

  const handleWhatsAppClick = (number: string) => {
    const message = encodeURIComponent('Halo, saya ingin menanyakan tentang Ganesha Science Institute');
    window.open(`https://wa.me/${number.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <>
      <Head title={title}>
        {description && <meta name="description" content={description} />}
      </Head>
      
      {/* Navbar */}
      <GaneshaNavbar />
      
      {/* Main Content */}
      <main className="flex flex-col min-h-screen">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />

      {/* WhatsApp Customer Service Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-3 space-y-2"
            >
              {whatsappContacts.map((contact, index) => (
                <motion.button
                  key={contact.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleWhatsAppClick(contact.number)}
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl group"
                >
                  <div className="bg-green-500 p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{contact.label}</div>
                    <div className="text-xs text-gray-600">{contact.number}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main WhatsApp Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl group"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
          </svg>
          <span className="font-medium">Hubungi CS</span>
          <motion.div
            animate={{ rotate: showOptions ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}