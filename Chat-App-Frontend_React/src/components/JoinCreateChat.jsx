import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { CreateRoomApi, joinChatApi } from "../Services/RoomService";
import useChatContext from "../Context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
});

const {roomid,userName,setroomId,setCurrentUser,setconnected} =useChatContext();
const navigate=useNavigate();
function handleFormInputChange(event) {
    setDetail({
    ...detail,
    [event.target.name]: event.target.value,
    });
}

function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
    toast.error("Invalid Input!!");
    return false;
    }
    return true;
}

async function joinChat() {
    if (validateForm()) {

        try{
            const room=await joinChatApi(detail.roomId);
            toast.success("joined...");
            setCurrentUser(detail.userName);
            setroomId(room.roomId);
            setconnected(true);
            navigate("/chat");

        }catch(error){
            if(error.status==400){
                
            toast.error(error.response.data);
            }else{
                console.log(error);
                toast.error("Error joining room");
            }
            
        
        }
    }

}

async function createRoom() {
    if (validateForm()) {
    console.log(detail);
    
    
    try{
        
        const response=await CreateRoomApi(detail.roomId);
        console.log(response); 
        toast.success("Room Created!!");
        setCurrentUser(detail.userName);
        setroomId(response.roomId);
        setconnected(true);
        navigate("/chat");
    }catch(error){
        console.log(error);
        if(error.status==400){
            toast.error("Room Already Exsist!");

        }
        console.log("Error In Creating Room!");

    }
    }
}

return (
    <div className="min-h-screen flex items-center justify-center border">
    <div className="p-10 dark:border-gray-400 border w-full max-w-md dark:bg-gray-900 shadow rounded-lg flex flex-col gap-6">
        <div>
        <img src={chatIcon} className="w-24 mx-auto" alt="Chat Icon" />
        </div>
        <h1 className="text-2xl font-semibold">Join Room/Create Room</h1>

        <div className="block font-medium mb-2">
        <label htmlFor="userName">Your Name</label>
        <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="userName"
            name="userName"
            placeholder="Enter Your Name"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        </div>

        <div className="block font-medium mb-2">
        <label htmlFor="roomId">Room ID/New Room ID</label>
        <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            placeholder="Enter The Room ID"
            type="text"
            id="roomId"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        </div>

        <div className="flex justify-center gap-9 mt-4">
        <button
            className="px-3 py-2 dark:bg-green-600 hover:dark:bg-green-900 rounded-lg"
            onClick={joinChat}
        >
            Join Room
        </button>
        <button
            className="px-3 py-2 dark:bg-yellow-600 hover:dark:bg-yellow-900 rounded-lg"
            onClick={createRoom}
        >
            Create Room
        </button>
        </div>
    </div>
    </div>
);
};

export default JoinCreateChat;
