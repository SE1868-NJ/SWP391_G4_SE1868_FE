import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../../styles/ChatPopup.css";
import avatarImage from "../../../images/EcoShipper_rbg.png";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào, bạn cần gì?",
      sender: "ai",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Danh sách các câu hỏi gợi ý
  const suggestedQuestions = [
    "EcoShipper là hệ thống như nào?",
    "Cách để tra cứu thông tin tài khoản shipper trong trang web này?"
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageToSend = inputMessage) => {
    if (!messageToSend.trim()) return;

    const userMessage = {
      text: messageToSend,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: messageToSend,
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

  // Hàm để xử lý khi người dùng click vào gợi ý câu hỏi
  const handleSuggestedQuestion = (question) => {
    // Gửi câu hỏi ngay lập tức
    handleSendMessage(question);
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
              <div className="header-left">
                <img 
                  src={avatarImage} 
                  alt="EcoShipper Logo" 
                  className="header-logo" 
                />
                <h3>EcoShipper AI</h3>
              </div>
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
                    Chờ một chút nhé...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="suggested-questions">
                {suggestedQuestions.map((question, index) => (
                  <button 
                    key={index}
                    className="question-button"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
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
                  onClick={() => handleSendMessage()} 
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