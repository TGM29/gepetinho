import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gepetinho - Your AI Assistant',
  description: 'Chat with Gepetinho, your personal AI assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
} 