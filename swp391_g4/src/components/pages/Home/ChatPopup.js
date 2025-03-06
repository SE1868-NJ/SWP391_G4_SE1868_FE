import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../../styles/ChatPopup.css";
import avatarImage from "../../../images/EcoShipper_rbg.png";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: inputMessage,
      });

      const aiMessage = {
        text: response.data.message,
        sender: "ai",
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Chi tiết lỗi:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage = {
        text: error.response?.data?.error 
          || error.message 
          || "Kết nối tới AI xảy ra lỗi. Vui lòng thử lại.",
        sender: "system",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-popup">
      <div className={`chat-container ${isOpen ? "open" : ""}`}>
        {!isOpen ? (
          <img 
            src={avatarImage} 
            alt="Chat Avatar" 
            className="chat-avatar" 
            onClick={toggleChat}
          />
        ) : (
          <>
            <div className="chat-header">
              <h3>EcoShipper AI</h3>
              <span 
                className="toggle-icon" 
                onClick={toggleChat}
              >
                −
              </span>
            </div>
  
            <div className="chat-body">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai loading">
                    Đang tải...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
  
              <div className="chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPopup;