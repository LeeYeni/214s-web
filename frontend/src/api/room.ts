import { BASE_URL } from "./base";
import { CreateRoomRequest, DeleteRoomResponse, UpdateRoomRequest, RoomResponse, CheckRoomResponse } from "@/schema/room";

// 방을 생성합니다.
export const createRoom = async (data: CreateRoomRequest): Promise<RoomResponse> => {
    const response = await fetch(`${BASE_URL}/api/room/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // TypeScript 객체를 JSON 문자열로 변환하여 본문에 담음
        body: JSON.stringify(data),
    });
    return response.json() as Promise<RoomResponse>;
}

// 사용자가 생성한 방 목록을 조회합니다.
export const getRoom = async (userId: number): Promise<RoomResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/room/?user_id=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    return response.json() as Promise<RoomResponse[]>;
}

// 방 이름, 패스워드, 메시지를 수정합니다.
export const updateRoom = async (room_id: number, data: UpdateRoomRequest): Promise<RoomResponse> => {
    const response = await fetch(`${BASE_URL}/api/room/${room_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    return response.json() as Promise<RoomResponse>;
}

// 방을 삭제합니다.
export const deleteRoom = async (room_id: number): Promise<DeleteRoomResponse> => {
    const response = await fetch(`${BASE_URL}/api/room/${room_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    return response.json() as Promise<DeleteRoomResponse>;
}

// 키 중복 검사를 진행합니다.
export const checkKeyAvailability = async (key: string): Promise<CheckRoomResponse> => {
    const response = await fetch(`${BASE_URL}/api/room/check-key?key=${key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    return response.json() as Promise<CheckRoomResponse>;
}