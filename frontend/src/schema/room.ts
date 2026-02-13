export interface RoomBase {
    key: string;
    name: string;
    message: string;
}

export interface CreateRoomRequest extends Omit<RoomBase, "key" | "name"> {
    user_id: number;
    key?: string | null;
    name?: string | null;
}

export interface UpdateRoomRequest extends Omit<RoomBase, "key" | "name" | "message"> {
    key?: string | null;
    name?: string | null;
    message?: string | null;
}

export interface RoomResponse extends RoomBase {
    room_id: number;
    click: number;
}

export interface DeleteRoomResponse {
    room_id: number;
    is_deleted: boolean;
}

export interface CheckRoomResponse {
    is_available: boolean;
}