import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/nav-logo.png",
  },
  title: "ZemenConverter - Ethiopian Date Converter",
  description: "Convert dates between Ethiopian and Gregorian calendars easily. Free, fast, and accurate date conversion tool.",
  keywords: ["Ethiopian calendar", "Gregorian calendar", "date converter", "Ethiopian date", "Ethiopian holidays"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " min-h-screen bg-background p-2 sm:p-0"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 