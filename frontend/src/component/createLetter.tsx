"use client";

import { useState } from "react";
import { createRoom, checkKeyAvailability } from "@/api/room";
import { CreateRoomRequest } from "@/schema/room";

interface CreateLetterProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLetter({ userId, isOpen, onClose, onSuccess }: CreateLetterProps) {
  const [formData, setFormData] = useState<Omit<CreateRoomRequest, 'user_id'>>({
    name: "",
    key: "",
    message: ""
  });

  const [keyStatus, setKeyStatus] = useState<{message: string; isAvailable: boolean | null}>({
    message: "",
    isAvailable: null
  });

  if (!isOpen) return null;

  // 방 번호(Key) 유효성 및 중복 체크 로직
  const handleKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setFormData({ ...formData, key: newKey });

    // 1. 빈 값인 경우 (선택 사항이므로 허용하지만 중복 체크는 패스)
    if (!newKey) {
      setKeyStatus({ message: "미입력 시 랜덤 키가 생성됩니다.", isAvailable: true });
      return;
    }

    // 2. 자릿수 및 형식 체크 (영문+숫자, 36자, 공백불가)
    const keyRegex = /^[a-zA-Z0-9]{6,36}$/;
    if (newKey.includes(" ")) {
      setKeyStatus({ message: "공백은 포함할 수 없습니다.", isAvailable: false });
      return;
    }
    if (!keyRegex.test(newKey)) {
      setKeyStatus({ message: "3~36자의 영문, 숫자 조합만 가능합니다.", isAvailable: false });
      return;
    }

    // 3. 서버 중복 체크
    try {
      const { is_available } = await checkKeyAvailability(newKey);
      setKeyStatus({
        message: is_available ? "사용 가능한 방 번호입니다!" : "이미 사용 중인 번호입니다.",
        isAvailable: is_available
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 방 번호가 입력되었는데 유효하지 않은 경우 차단
    if (formData.key && keyStatus.isAvailable === false) return;

    try {
      await createRoom({ ...formData, user_id: userId });
      onSuccess();
      onClose();
      setFormData({ name: "", key: "", message: "" });
      setKeyStatus({ message: "", isAvailable: null });
    } catch (error) {
      alert("생성에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-800">편지 작성하기</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 방 이름 (선택) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest">방 이름 (선택)</label>
              <input
                type="text"
                placeholder="방 이름을 적어주세요"
                className="w-full px-0 py-2 border-b border-gray-100 focus:border-rose-500 focus:outline-none transition-colors text-sm"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 방 번호 (선택 + 중복체크) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest">방 번호 (선택)</label>
              <input
                type="text"
                placeholder="6~36자 영문+숫자 (띄어쓰기 불가)"
                className="w-full px-0 py-2 border-b border-gray-100 focus:border-rose-500 focus:outline-none transition-colors text-sm font-mono"
                value={formData.key || ""}
                onChange={handleKeyChange}
              />
              {keyStatus.message && (
                <p className={`text-[10px] mt-1 font-bold ${keyStatus.isAvailable ? 'text-blue-500' : 'text-rose-500'}`}>
                  {keyStatus.message}
                </p>
              )}
            </div>

            {/* 메시지 (필수) */}
            <div>
              <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">편지 (필수)</label>
              <textarea
                required
                rows={4}
                placeholder="진심이 담긴 메시지를 적어주세요."
                className="w-full p-4 mt-2 bg-gray-50 rounded-2xl focus:outline-none focus:ring-1 focus:ring-rose-200 resize-none text-sm leading-relaxed"
                value={formData.message || ""}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={!formData.message || (formData.key !== "" && keyStatus.isAvailable === false)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-rose-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95 shadow-lg"
            >
              편지 등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}