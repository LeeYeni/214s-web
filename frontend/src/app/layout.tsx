import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "214s | 밸런타인데이 에디션",
  description: "클릭할 수 없는 버튼, 째깍거리는 시간. 밸런타인데이의 설렘을 담아 시간이 흐른 뒤에만 열리는 특별한 편지를 확인해보세요.",
  keywords: ["214s", "밸런타인데이", "인스타그램", "깜짝편지", "디지털편지", "기다림의미학", "이벤트", "2월 14일", "사이트", "웹사이트"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          flex flex-col text-black min-h-screen bg-white
        `}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
