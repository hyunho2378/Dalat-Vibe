import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// COMPONENT: ChatWidget - Global Floating Chatbot with Gemini AI
// =============================================================================

const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const prevLangRef = useRef(i18n.language);

    // Initialize greeting message based on current language
    useEffect(() => {
        setMessages([{
            id: 1,
            type: 'ai',
            text: t('chat.greeting')
        }]);
    }, []);

    // Update greeting when language changes
    useEffect(() => {
        if (prevLangRef.current !== i18n.language) {
            // Reset messages with new language greeting
            setMessages([{
                id: Date.now(),
                type: 'ai',
                text: t('chat.greeting')
            }]);
            prevLangRef.current = i18n.language;
        }
    }, [i18n.language, t]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputValue.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Call the backend chat API with current language
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage.text,
                    history: messages.slice(-10),
                    language: i18n.language // Send current language
                })
            });

            const data = await response.json();

            if (response.ok && data.response) {
                const aiMessage = {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: data.response
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                // Error response
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: t('chat.errorProcess')
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: t('chat.errorConnection')
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
            {/* Chat Window */}
            <div
                className={`
                    absolute bottom-16 sm:bottom-20 right-0
                    w-[calc(100vw-2rem)] max-w-[380px] sm:w-96 
                    h-[70vh] max-h-[500px] min-h-[350px]
                    bg-white/95 backdrop-blur-xl
                    rounded-2xl shadow-2xl
                    flex flex-col
                    overflow-hidden
                    border border-white/20
                    transition-all duration-300 ease-in-out
                    ${isOpen
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }
                `}
                role="dialog"
                aria-label="Chat with Dalat Guide"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
                        <h3 className="font-tenor text-lg text-white">{t('chat.title')}</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="
                            p-1.5 rounded-full
                            hover:bg-white/20
                            transition-colors duration-200
                        "
                        aria-label="Close chat"
                    >
                        <X className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`
                                flex
                                ${message.type === 'user' ? 'justify-end' : 'justify-start'}
                            `}
                        >
                            <div
                                className={`
                                    max-w-[85%] px-4 py-2.5 rounded-2xl
                                    font-manrope text-sm leading-relaxed
                                    ${message.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                                    }
                                `}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 rounded-bl-md">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    <span className="text-sm text-gray-500">{t('chat.thinking')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={t('chat.placeholder')}
                            disabled={isLoading}
                            className="
                                flex-1 px-4 py-2.5
                                bg-gray-100 rounded-full
                                font-manrope text-sm text-gray-800
                                placeholder:text-gray-400
                                border border-transparent
                                focus:border-blue-300 focus:bg-white focus:outline-none
                                transition-colors duration-200
                                disabled:opacity-50
                            "
                            aria-label="Type your message"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            className={`
                                p-2.5 rounded-full
                                transition-all duration-200
                                ${inputValue.trim() && !isLoading
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
                            `}
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            {/* FAB Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full
                    flex items-center justify-center
                    shadow-lg
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:shadow-xl
                    active:scale-95
                    ${isOpen
                        ? 'bg-gray-700 rotate-180'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }
                `}
                aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" strokeWidth={2} />
                ) : (
                    <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
