'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle, X, Bot, User } from "lucide-react";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageIdCounter = useRef(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        messageIdCounter.current += 1;
        const currentId = messageIdCounter.current;
        const userMessageContent = message;

        // Add user message
        const userMessage: Message = {
            id: `user-${currentId}`,
            role: 'user',
            content: userMessageContent,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setIsTyping(true);

        try {
            // Fetch AI response from backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessageContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chat API');
            }

            const data = await response.json();
            
            messageIdCounter.current += 1;
            const assistantMessage: Message = {
                id: `assistant-${messageIdCounter.current}`,
                role: 'assistant',
                content: data.response || data.message || 'Sorry, I could not process your request.',
                timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error fetching chat response:', error);
            
            // Fallback to simulated response on error
            messageIdCounter.current += 1;
            const assistantMessage: Message = {
                id: `assistant-${messageIdCounter.current}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [message]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-96 h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col">
                    {/* Header */}
                    <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-semibold text-lg">Safety Assistant</h2>
                                <p className="text-blue-100 text-xs">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                    <MessageCircle className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Welcome to Safety Assistant
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Ask me anything about emergency preparedness, first aid, or safety procedures!
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                                ? 'bg-blue-500'
                                                : 'bg-linear-to-br from-indigo-500 to-purple-600'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                    ? 'bg-blue-500 text-white rounded-br-sm'
                                                    : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-sm'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <p className={`text-xs mt-1 ${msg.role === 'user'
                                                    ? 'text-blue-100'
                                                    : 'text-slate-500 dark:text-slate-400'
                                                }`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about safety..."
                                className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping}
                                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                            Ask about emergencies, first aid, or safety tips
                        </p>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-200 flex items-center justify-center group"
                >
                    <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}
        </div>
    );
}