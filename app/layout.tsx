import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from "nextjs-toploader";
import NextAuthProvider from "@/providers/next-auth-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Bisa pilih lebih dari satu
  variable: "--font-poppins", // Variable CSS agar bisa digunakan di global CSS
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"], // Bold untuk heading
  variable: "--font-montserrat",
});

export const metadata = {
  title: 'Admin Shop',
  description: 'Halaman dashboard admin',
};

export default async function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased overflow-hidden`}
      >
        <NextAuthProvider>
          <NextTopLoader showSpinner={false} />
          <ThemeProvider attribute="class" defaultTheme="system">
            <Toaster />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
