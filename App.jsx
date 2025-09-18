import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import "./app.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

 
  const socket = useMemo(() => io("https://ayushchat.up.railway.app"), []);

  useEffect(() => {
  socket.on("ReceiveMessage", (data) => {
    if (data.senderId === socket.id) return; // apna msg ignore kar
    setMessages((prev) => [...prev, { text: data.text, self: false }]);
  });

  return () => socket.off("ReceiveMessage");
}, [socket]);


const sendMessage = () => {
  if (!input.trim()) return;
  const msgData = { text: input };
  
  setMessages((prev) => [...prev, { ...msgData, self: true }]);
  
  socket.emit("SendMessage", msgData);

  setInput("");
};

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-2xl font-semibold">
          Ayush Chat Room
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 max-w-[70%] rounded-xl text-sm ${
                msg.self
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center border-t p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
