"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getMessage } from "@/api/message";
import { MessageResponse } from "@/schema/message";

export default function RoomPage() {
  const params = useParams();
  const roomKey = params.room_id as string;

  const [message, setMessage] = useState<MessageResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [isLocked, setIsLocked] = useState(true); 
  const [isOpened, setIsOpened] = useState(false); 
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 }); 
  const [loading, setLoading] = useState(false); // 편지 로딩 상태
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 1. 타이머 로직 (30초 동안은 도망다님)
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsLocked(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. 마우스 피하기 로직 (Locked 상태일 때만)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isLocked || isOpened) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const btn = buttonRef.current?.getBoundingClientRect();
    if (!btn) return;

    const btnCenterX = btn.left + btn.width / 2;
    const btnCenterY = btn.top + btn.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
    );

    if (distance < 120) {
      const maxX = window.innerWidth / 2 - 100;
      const maxY = window.innerHeight / 2 - 100;
      const newX = (Math.random() - 0.5) * maxX * 2;
      const newY = (Math.random() - 0.5) * maxY * 2;
      setBtnPos({ x: newX, y: newY });
    }
  };

  // 3. 버튼 클릭 시 편지 불러오기 (핵심 로직)
  const handleOpenLetter = async () => {
    if (isLocked) return; // 아직 잠겨있으면 아무 일도 안 함

    setLoading(true);
    try {
      const data = await getMessage(roomKey);
      setMessage(data);
      setIsOpened(true);
    } catch (error) {
      console.error("편지를 불러오지 못했습니다.");
      alert("편지를 여는 데 실패했습니다. 다시 시도해주세요!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-white flex flex-col items-center justify-center px-6"
      onMouseMove={handleMouseMove}
    >
      {!isOpened ? (
        <>
          <button
            ref={buttonRef}
            disabled={loading}
            style={{
              transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
              transition: isLocked ? "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 0.5s ease-in-out",
            }}
            onClick={handleOpenLetter}
            className={`
              relative w-56 aspect-[3/2] flex items-center justify-center
              transition-all active:scale-95 group
              ${isLocked ? "cursor-none" : "hover:scale-105 animate-bounce"}
              ${loading ? "opacity-50 cursor-wait" : ""}
            `}
          >
          {/* SVG 봉투 레이어 */}
          <svg
            viewBox="0 0 100 66"
            className={`absolute inset-0 w-full h-full drop-shadow-2xl transition-colors duration-300 ${
            isLocked ? "fill-gray-700" : "fill-rose-500"
          }`}
          >
            {/* 봉투 몸체 */}
            <path d="M0 0 L100 0 L100 66 L0 66 Z" />
            {/* 뒷면 날개 (그림자 효과) */}
            <path 
              d="M0 66 L50 33 L100 66" 
              fill="none" 
              stroke={isLocked ? "#4B5563" : "#FB7185"} 
              strokeWidth="1" 
            />
            {/* 윗날개 부분 */}
            <path 
              d="M0 0 L50 35 L100 0" 
              className={isLocked ? "fill-gray-800" : "fill-rose-400"} 
            />
          </svg>

          {/* 텍스트 레이어 */}
          <div className="relative z-10 flex flex-col items-center">
            <span className={`font-black text-2xl tracking-tighter ${isLocked ? "text-gray-400" : "text-white"}`}>
              {loading ? "..." : isLocked ? "CLICK!" : "OPEN"}
            </span>
          </div>
          </button>
          </>
        ) : (
        /* 편지 공개 화면 */
        <div className="max-w-md w-full p-12 bg-white border border-rose-100 rounded-[3rem] shadow-xl animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-8">
            <span className="text-5xl block animate-bounce">💝</span>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
              {message?.message}
            </p>
            <div className="pt-8 border-t border-gray-50">
              <p className="text-[10px] text-gray-300 font-bold tracking-[0.4em] uppercase">
                Happy Valentine's Day
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}