import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../../styles/ChatPopup.css";
import avatarImage from "../../../images/EcoShipper_rbg_noname.png";

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
    <div className="popup_container">
      <div className={`popup_chatbox ${isOpen ? "popup_open" : ""}`}>
        {!isOpen ? (
          <img 
            src={avatarImage} 
            alt="Chat Avatar" 
            className="popup_avatar" 
            onClick={toggleChat}
          />
        ) : (
          <>
            <div className="popup_header">
              <div className="popup_header_left">
                <img 
                  src={avatarImage} 
                  alt="EcoShipper Logo" 
                  className="popup_logo" 
                />
                <h3>EcoShipper AI</h3>
              </div>
              <span 
                className="popup_close_button" 
                onClick={toggleChat}
              >
                −
              </span>
            </div>
  
            <div className="popup_body">
              <div className="popup_messages">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`popup_message popup_message_${msg.sender}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="popup_message popup_message_ai popup_message_loading">
                    Chờ một chút nhé...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="popup_suggested_questions">
                {suggestedQuestions.map((question, index) => (
                  <button 
                    key={index}
                    className="popup_question_button"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
  
              <div className="popup_input_container">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  disabled={isLoading}
                  className="popup_input_field"
                />
                <button 
                  onClick={() => handleSendMessage()} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="popup_send_button"
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