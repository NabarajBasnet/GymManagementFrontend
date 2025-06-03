"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Moon, Sun, Bot, User, Sparkles } from "lucide-react";

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input after sending message
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const talkToAiStudio = async (userMessage) => {
    setIsLoading(true);

    try {
      // Add user message to chat
      const userMsg = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Prepare the conversation history for the API
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDTsgUlg9osoYnYIAygRTILrYOiztGzIVQ`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              ...conversationHistory,
              {
                role: "user",
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response. Please try again.";

      // Add AI response to chat
      const aiMsg = {
        role: "ai",
        content: aiReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error talking to Gemini API:", error);
      const errorMsg = {
        role: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      talkToAiStudio(inputText);
      setInputText("");
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChat = () => {
    setMessages([]);
  };

  const themeClasses = isDark
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900";

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <div className="flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white/80 backdrop-blur-sm border-gray-200"
          } border-b transition-all duration-300`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-blue-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600"
                } shadow-lg`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Powered by Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Clear Chat
                </button>
              )}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className={`p-4 rounded-2xl ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-lg mb-6`}
              >
                <Bot
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h2
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Welcome to AI Assistant
                </h2>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } mb-4`}
                >
                  Start a conversation and I'll help you with anything you need
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    💻 Coding help
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    🤖 AI questions
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    📚 Learning tips
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    🚀 Career advice
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-2xl ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : isDark
                        ? "bg-gray-700"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot
                        className={`w-4 h-4 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                          : isDark
                          ? "bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700"
                          : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <div
                      className={`text-xs mt-1 px-1 ${
                        message.role === "user" ? "text-right" : "text-left"
                      } ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-2xl">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <Bot
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 rounded-bl-md ${
                    isDark
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex space-x-1">
                    <div
                      className={`w-2 h-2 ${
                        isDark ? "bg-blue-400" : "bg-blue-600"
                      } rounded-full animate-bounce`}
                    ></div>
                    <div
                      className={`w-2 h-2 ${
                        isDark ? "bg-blue-400" : "bg-blue-600"
                      } rounded-full animate-bounce`}
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 ${
                        isDark ? "bg-blue-400" : "bg-blue-600"
                      } rounded-full animate-bounce`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <div
          className={`${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white/80 backdrop-blur-sm border-gray-200"
          } border-t p-4 transition-all duration-300`}
        >
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (inputText.trim() && !isLoading) {
                      talkToAiStudio(inputText);
                      setInputText("");
                    }
                  }
                }}
                placeholder="Type your message here... (Enter to send, Shift+Enter for new line)"
                className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                rows="1"
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                  height: "auto",
                }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => {
                if (inputText.trim() && !isLoading) {
                  talkToAiStudio(inputText);
                  setInputText("");
                }
              }}
              className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:transform-none disabled:cursor-not-allowed ${
                inputText.trim() && !isLoading
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : isDark
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!inputText.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        textarea {
          height: auto;
          min-height: 48px;
          max-height: 120px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default AiAssistant;
