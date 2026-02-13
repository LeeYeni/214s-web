"use client";

import { useState, useEffect } from "react";
import { updateRoom, checkKeyAvailability } from "@/api/room";
import { RoomResponse, UpdateRoomRequest } from "@/schema/room";

interface UpdateLetterProps {
  room: RoomResponse; // 수정할 대상인 방의 데이터가 필요합니다.
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateLetter({ room, isOpen, onClose, onSuccess }: UpdateLetterProps) {
  // 1. 초기 데이터를 room에서 가져와 설정합니다.
  const [formData, setFormData] = useState({
    name: room.name,
    key: room.key,
    message: room.message
  });

  const [keyStatus, setKeyStatus] = useState<{message: string; isAvailable: boolean | null}>({
    message: "",
    isAvailable: true // 초기값은 현재 자신의 키이므로 사용 가능 상태
  });

  const [loading, setLoading] = useState(false);

  // 모달이 열릴 때 데이터를 다시 동기화합니다.
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: room.name, key: room.key, message: room.message });
      setKeyStatus({ message: "", isAvailable: true });
    }
  }, [isOpen, room]);

  if (!isOpen) return null;

  // 방 번호(Key) 유효성 및 중복 체크
  const handleKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value.trim(); // 공백 제거
    setFormData({ ...formData, key: newKey });

    // A. 현재 방의 키와 동일하다면 중복 체크 불필요
    if (newKey === room.key) {
      setKeyStatus({ message: "", isAvailable: true });
      return;
    }

    // B. 형식 체크
    const keyRegex = /^[a-zA-Z0-9]{6,36}$/;
    if (newKey.includes(" ")) {
      setKeyStatus({ message: "공백은 포함할 수 없습니다.", isAvailable: false });
      return;
    }
    if (!keyRegex.test(newKey)) {
      setKeyStatus({ message: "6~36자의 영문, 숫자 조합만 가능합니다.", isAvailable: false });
      return;
    }

    // C. 서버 중복 체크
    try {
      const { is_available } = await checkKeyAvailability(newKey);
      setKeyStatus({
        message: is_available ? "사용 가능한 방 번호입니다!" : "이미 사용 중인 번호입니다.",
        isAvailable: is_available
      });
    } catch (error) {
      console.error("중복 체크 오류:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (keyStatus.isAvailable === false) return;

    setLoading(true);
    try {
      // API 요구 사양에 맞춰 room_id 혹은 key를 식별자로 보냅니다.
      await updateRoom(room.room_id, {
        name: formData.name,
        key: formData.key,
        message: formData.message
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      alert("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-800">편지 수정하기</h3>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 방 이름 */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest">방 이름</label>
              <input
                type="text"
                placeholder="방 이름을 적어주세요"
                className="w-full px-0 py-3 border-b border-gray-100 focus:border-rose-500 focus:outline-none transition-colors text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 방 번호 (Key) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest">방 번호</label>
              <input
                type="text"
                placeholder="6~36자 영문+숫자 (띄어쓰기 불가)"
                className={`w-full px-0 py-3 border-b focus:outline-none transition-colors text-sm font-mono ${
                  keyStatus.isAvailable === false ? 'border-rose-500 text-rose-500' : 'border-gray-100 focus:border-rose-500'
                }`}
                value={formData.key}
                onChange={handleKeyChange}
              />
              {keyStatus.message ? (
                <p className={`text-[10px] mt-2 font-bold ${keyStatus.isAvailable ? 'text-blue-500' : 'text-rose-500'}`}>
                  {keyStatus.message}
                </p>
              ) : (
                <p className="text-[9px] text-gray-500 mt-2 ml-1 uppercase tracking-tighter">키를 수정하면 이전 링크는 더 이상 작동하지 않습니다.</p>
              )}
            </div>

            {/* 메시지 */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest">편지</label>
              <textarea
                required
                rows={4}
                className="w-full p-5 mt-2 bg-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none text-sm leading-relaxed text-gray-700 font-medium"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading || keyStatus.isAvailable === false}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95 shadow-xl shadow-gray-100"
            >
              {loading ? "수정 중..." : "수정 완료"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}