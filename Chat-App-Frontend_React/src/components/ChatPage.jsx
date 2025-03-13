import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend, MdCall, MdVideocam } from "react-icons/md";
import useChatContext from "../Context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import { Client } from '@stomp/stompjs';
import { stringify } from "postcss";
import { getMessages } from '../Services/RoomService';
import { getTimeAgo } from "../config/TimeHelper";

const ChatPage = () => {
  const { roomId, currentUser, connected } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
  
    if (roomId) {
      loadMessages(); 
    }
  }, [roomId]); 

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight, 
        behavior: 'smooth',
      });
    }
  }, [messages]); 
  
  
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setStompClient(client);
          toast.success("Connected to WebSocket");

        
          client.subscribe(`/topic/room/${roomId}`, (message) => {
            console.log("Received: ", message);
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
          });
        },
        onStompError: (frame) => {
          console.error("STOMP error: " + frame.headers['message']);
        },
      });

      client.activate();
    };

    if (roomId) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  
  const handleSendMessage =async () => {
    if (input.trim() !== "" && stompClient && stompClient.connected) {
      console.log(input);
      const message = {
        content: input,
        sender: currentUser,
        roomId:roomId,
      };
  
      
      stompClient.publish({
        destination: `/app/sendmessage/${roomId}`,
        body: JSON.stringify(message),
      });
  
      setInput(""); 
    } else {
      toast.error("Unable to send message. WebSocket not connected.");
    }
  };
  
  

  const handleLeaveRoom = () => {
    if (stompClient) {
      stompClient.deactivate();
      toast.success("Left the room");
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      
      {/* Header */}
      <header className="fixed top-0 w-full h-16 shadow border dark:border-gray-700 dark:bg-gray-900 flex justify-between px-6 items-center">
        <div className="text-lg font-semibold">
          <h1>Room: <span className="font-normal">{roomId}</span></h1>
        </div>

        {/* User Info */}
        <div className="text-lg font-semibold">
          <h1>User: <span className="font-normal">{currentUser}</span></h1>
        </div>

        {/* Call & Leave Room Buttons */}
        <div className="flex items-center gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
            <MdCall size={24} />
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
            <MdVideocam size={24} />
          </button>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <main
  ref={chatBoxRef}
  className="py-20 w-2/3 mx-auto overflow-y-auto h-screen dark:border-gray-700 dark:bg-slate-500"
>
  {messages.map((message, index) => (
    <div 
    key={index} 
    className={`flex ml-4 mr-4 ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
  >
    <div 
      className={`my-2 p-4 rounded-xl max-w-xs 
        ${message.sender === currentUser ? "bg-green-700" : "bg-gray-900"}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img 
          className="h-10 w-10 rounded-full object-cover" 
          src="https://avatar.iran.liara.run/public/2" 
          alt="avatar" 
        />
        
        {/* Message Content */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-white">
            {message.sender}
          </p>
          <p className="text-base text-white-200">
            {message.content}
          </p>
          <p className="text-xs text-white-800 mt-1">
            {getTimeAgo(message.timeStamp)}
          </p>
        </div>
      </div>
    </div>
  </div>
  
  ))}
</main>


      {/* Chat Input */}
      <div className="fixed bottom-2 w-full flex justify-center px-4">
        <div className="w-full max-w-[800px] flex items-center gap-2 bg-gray-800 p-3 rounded-lg border dark:border-gray-700">
          
          {/* Message Input */}
          <input
          onKeyDown={(e)=>{
          if(e.key === "Enter"){
            handleSendMessage();
          }
          }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-5 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
            ref={inputRef}
          />

          {/* Attach Button */}
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg">
            <MdAttachFile size={24} />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
          >
            <MdSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
