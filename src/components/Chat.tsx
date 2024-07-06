// src/components/Chat.tsx

import React, { useState, useEffect } from "react";
import { addMessage, getAllMessages, deleteMessage, updateMessage, Message } from "../utils/indexedDB";
import { encryptMessage, decryptMessage } from "../utils/encryption";
import { formatDate } from "../utils/formatDate";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getAllMessages();
      setMessages(messages);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    const encryptedMessage = encryptMessage(input);
    const newMessage: Omit<Message, "id"> = {
      content: encryptedMessage,
      timestamp: Date.now()
    };
    await addMessage(newMessage);
    const updatedMessages = await getAllMessages();
    setMessages(updatedMessages);
    setInput("");
  };

  const handleDeleteMessage = async (id: number) => {
    await deleteMessage(id);
    setMessages(messages.filter((message) => message.id !== id));
  };

  const handleUpdateMessage = async (id: number) => {
    const newValue = prompt("Enter new message:");
    if (newValue) {
      const encryptedMessage = encryptMessage(newValue);
      const updatedMessage: Message = {
        id,
        content: encryptedMessage,
        timestamp: Date.now()
      };
      await updateMessage(updatedMessage);
      setMessages(messages.map((message) => (message.id === id ? updatedMessage : message)));
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center p-4">
      <h1 className="text-3xl mb-4">Chat</h1>
      <div className="w-full max-w-md">
        <div className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-2 rounded-l bg-secondary text-white focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl mb-2">Messages:</h2>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="relative p-3 bg-secondary rounded-lg hover:bg-gray-700 transition group">
                <p>{decryptMessage(message.content)}</p>
                <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                <div className="absolute  text-xs -top-1 right-0 p-2 space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleDeleteMessage(message.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdateMessage(message.id!)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No messages found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
