"use client";

import { getUrl } from "@/api/user";

export default function Home() {
  const handleKakaoLogin = async () => {
    try {
      const { url } = await getUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("로그인 페이지 로드 실패:", error);
      alert("로그인 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
      {/* 서비스 소개 영역 */}
      <div className="space-y-3 mb-16">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 italic">
          Wait for <br />
          <span className="text-rose-500">Valentine</span>
        </h2>
      </div>

      {/* 카카오 로그인 버튼 */}
      <button
        onClick={handleKakaoLogin}
        className="group relative flex items-center justify-center gap-3 w-full max-w-xs py-4 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-lg hover:bg-[#FADA0A] transition-all active:scale-95 shadow-md overflow-hidden"
      >
        <svg 
          className="w-6 h-6" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3C7.029 3 3 6.129 3 10.015c0 2.456 1.587 4.62 4.044 5.922l-1.022 3.754c-.1.366.115.736.478.823.118.028.241.018.35-.027l4.39-2.915c.571.066 1.155.101 1.758.101 4.971 0 8.971-3.129 8.971-7.015S16.971 3 12 3z" />
        </svg>
        카카오로 시작하기
      </button>
    </div>
  );
}