import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

// AI Mentor Page
function AIMentor() {
  // Chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi 👋 I'm your EduNexa AI Mentor.",
    },
  ]);

  // User input
  const [input, setInput] = useState("");

  // Typing animation
  const [isTyping, setIsTyping] = useState(false);

  // Load previous chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `https://learning-platform-muyw.onrender.com/api/ai/history/${userId}`
        );

        const history = response.data.map((chat) => ({
          id: chat._id,
          sender: chat.sender,
          text: chat.text,
        }));

        if (history.length > 0) {
          setMessages(history);
        }
      } catch (error) {
        console.error("Unable to load chat history.");
      }
    };

    fetchHistory();
  }, []);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
    };

    // Show user message immediately
    setMessages((prev) => [...prev, newMessage]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://learning-platform-muyw.onrender.com/api/ai/chat",
        {
          userId: localStorage.getItem("userId"),
          message: userMessage,
        }
      );

      const aiReply = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="home-page">
      <Sidebar />

      <div className="hero">
        <h1>AI Mentor</h1>

        <div className="chat-container">
          <div className="chat-body">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
              />
            ))}

            {isTyping && (
              <ChatMessage
                sender="ai"
                text="Typing..."
              />
            )}
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

export default AIMentor;