import { BASE_URL } from "./base";
import { MessageResponse } from "@/schema/message";

// 수신자가 방에 들어와 메시지를 조회합니다.
export const getMessage = async (key: string): Promise<MessageResponse> => {
    const response = await fetch(`${BASE_URL}/api/message/?room_key=${key}`, {
        method: "GET",
        headers:  {
            "Content-Type": "application/json"
        },
    });
    return response.json() as Promise<MessageResponse>;
}