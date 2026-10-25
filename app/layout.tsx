
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaySo",
  description: "Campus Problem Resolution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-full flex flex-col font-sans antialiased">
       <ThemeProvider
       attribute="class"
          defaultTheme="dark"
         
       >
        <Toaster/>
         <AuthProvider
         
         >{children}</AuthProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}

