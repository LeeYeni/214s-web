import { BASE_URL } from "./base";
import { URLResponse } from "@/schema/user";

// 카카오 url 로그인을 제공합니다.
export const getUrl = async (): Promise<URLResponse> => {
   const response = await fetch(`${BASE_URL}/api/user/url`);
   return response.json() as Promise<URLResponse>;
}