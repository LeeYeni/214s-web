"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoom, deleteRoom } from "@/api/room"; // updateRoom 추가 필요
import { RoomResponse } from "@/schema/room";
import CreateLetter from "@/component/createLetter";
import UpdateLetter from "@/component/updateLetter"; // 수정용 컴포넌트 (아래 생성법 설명)

export default function MyPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.user_id);

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 수정할 방 데이터를 담는 상태
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRoom(userId);
      setRooms(data);
    } catch (error) {
      console.error("방 목록 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 수정 모달 열기
  const handleEditClick = (e: React.MouseEvent, room: RoomResponse) => {
    e.stopPropagation(); // 카드 클릭(이동) 방지
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, roomId: number) => {
    e.stopPropagation();
    if (!confirm("정말 이 편지함을 삭제할까요?")) return;
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((room) => room.room_id !== roomId));
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleCopy = async (e: React.MouseEvent, roomKey: string, roomId: number) => {
    e.preventDefault();
    e.stopPropagation();
    const roomUrl = `${window.location.origin}/room/${roomKey}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopiedId(roomId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold text-xs hover:bg-rose-500 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
        >
          + 편지 작성하기
        </button>
      </div>

      {/* 생성 모달 */}
      <CreateLetter
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRooms}
      />

      {/* 수정 모달 */}
      {selectedRoom && (
        <UpdateLetter
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
          onSuccess={fetchRooms}
        />
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-300 animate-pulse font-bold">로딩 중...</div>
      ) : rooms.length > 0 ? (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              onClick={() => router.push(`/room/${room.key}`)}
              className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-rose-200 hover:shadow-md transition-all cursor-pointer relative"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                   <h3 className="font-bold text-lg text-gray-800 group-hover:text-rose-500 transition-colors">
                    {room.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {room.message ? (room.message.length > 30 ? `${room.message.slice(0, 30)}...` : room.message) : "메시지가 없습니다."}
                </p>
                <div className="flex gap-3 mt-4 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    Clicks: {room.click}
                  </span>
                  <button
                    onClick={(e) => handleCopy(e, room.key, room.room_id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all ${
                      copiedId === room.room_id 
                      ? "bg-rose-500 border-rose-500 text-white" 
                      : "bg-white text-rose-400 border-rose-100 hover:bg-rose-50"
                    }`}
                  >
                    {copiedId === room.room_id ? "URL 복사됨!" : "링크 복사"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* 수정 버튼 */}
                <button
                  onClick={(e) => handleEditClick(e, room)}
                  className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                  aria-label="수정"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => handleDelete(e, room.room_id)}
                  className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                  aria-label="삭제"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
          <p className="text-gray-400">새로운 편지를 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}