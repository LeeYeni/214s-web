"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 왼쪽: 로고 구역 */}
        <Link href="/" className="flex items-center gap-2 group">
            <Image 
                src="/214s_logo.png"
                alt="214s Logo"
                fill 
                className="object-contain"
                priority // 헤더 로고는 가장 먼저 로드되도록 설정
            />
        </Link>

      </div>
    </header>
  );
}