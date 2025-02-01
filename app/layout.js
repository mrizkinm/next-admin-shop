import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from "nextjs-toploader";
import { getStoreInfo } from "@/lib/api";
import { StoreProvider } from "@/context/store-context";

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

export async function generateMetadata() {
  // Ambil data store secara dinamis
  const store = await getStoreInfo();
  const storeInfo = store;

  return {
    title: storeInfo.name,
    description: storeInfo.description,
  };
}

export default async function RootLayout({ children }) {
  const store = await getStoreInfo();
  const storeInfo = store;

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased overflow-hidden`}
      >
        <NextTopLoader showSpinner={false} />
        <StoreProvider storeInfo={storeInfo}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <Toaster />
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
