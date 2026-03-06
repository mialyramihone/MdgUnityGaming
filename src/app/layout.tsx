import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MDG UNITY GAMING',
  description: 'Plateforme',
  icons: {
    icon: '/logo.png', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
       <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#ffffff', color: '#292929' }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}