import { publicAxios } from "../config/AxiosHelper";

export const CreateRoomApi = async (roomDetail) => {
    try {
        const response = await publicAxios.post("/api/rooms/create", roomDetail);
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error; 
    }
};

export const joinChatApi = async (roomId) => {
    try {
        const response = await publicAxios.get(`/api/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getMessages = async (roomId, size = 50, page = 0) => {
    try{
    const response = await publicAxios.get(`/api/rooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
    }catch(error){
        console.error("Api Error",error);
        throw error;

    }
};