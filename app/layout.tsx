import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Engagement Tracker",
  description: "Track and analyze user engagement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-main min-h-screen')}>
        <div className="grid grid-rows-[64px,1fr,64px] min-h-screen">
          <Header></Header>
          {children}
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
