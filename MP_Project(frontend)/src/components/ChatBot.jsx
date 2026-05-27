import React, { useState, useRef, useEffect } from 'react';
import { data } from '../restApi.json';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const welcomeMessage = {
    type: 'bot',
    text: "👋 Hi! I'm SmartDine AI Assistant. Ask me about our menu!\n\nTry asking:\n• \"Show me spicy dishes under 200\"\n• \"What veg options do you have?\"\n• \"Show dinner menu\"\n• \"What's your cheapest dish?\"",
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([welcomeMessage]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const handleClose = () => {
        setIsOpen(false);
        setMessages([welcomeMessage]);
        setInput('');
        setIsTyping(false);
    };

    const dishes = data[0].dishes;

    const scrollToBottom = () => {
        setTimeout(() => {
            const userMessages = messagesContainerRef.current?.querySelectorAll('.chatbot-message.user');
            if (userMessages && userMessages.length > 0) {
                const lastUserMsg = userMessages[userMessages.length - 1];
                lastUserMsg.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const processQuery = (query) => {
        const q = query.toLowerCase();

        // Greetings
        if (/^(hi|hello|hey|hii|hola|namaste|greetings)/.test(q)) {
            return "👋 Hello! Welcome to SmartDine! I can help you explore our menu. Try asking about spicy dishes, veg options, budget-friendly meals, or any specific category like breakfast, lunch, or dinner!";
        }

        // Thanks
        if (/^(thanks|thank you|thankyou|dhanyavaad|shukriya)/.test(q)) {
            return "😊 You're welcome! Feel free to ask anything else about our menu. Happy to help!";
        }

        // Help
        if (/^(help|what can you do|options)/.test(q)) {
            return "🤖 I can help you with:\n\n• 🔥 Find **spicy / mild / medium** dishes\n• 💰 Find dishes **under a budget** (e.g., \"under 200\")\n• 🥬 Browse our **100% pure veg** menu\n• 🍽️ Search by **category** (Breakfast, Lunch, Dinner, Starters, Dessert)\n• 📋 Show the **full menu**\n• ⭐ Get **recommendations**\n\nJust type your query!";
        }

        // Full menu
        if (/\b(full menu|all dishes|menu|show menu|complete menu|saara menu)\b/.test(q)) {
            return formatDishes(dishes, "Here's our complete menu:");
        }

        // Recommendations
        if (/\b(recommend|suggestion|suggest|best|popular|special|chef.?s? choice)\b/.test(q)) {
            const recommended = dishes.filter(d => d.id === 1 || d.id === 5 || d.id === 7);
            return formatDishes(recommended, "⭐ Chef's Recommendations:");
        }

        // Cheapest
        if (/\b(cheap|cheapest|sabse sasta|lowest price|budget|sasta)\b/.test(q)) {
            const sorted = [...dishes].sort((a, b) => a.price - b.price);
            return formatDishes(sorted.slice(0, 3), "💰 Our most budget-friendly dishes:");
        }

        // Most expensive / premium
        if (/\b(expensive|costly|premium|luxury|mahanga)\b/.test(q)) {
            const sorted = [...dishes].sort((a, b) => b.price - a.price);
            return formatDishes(sorted.slice(0, 3), "💎 Our premium dishes:");
        }

        // Now do combined filtering
        let filtered = [...dishes];
        let filterDescriptions = [];

        // Spice level filter
        if (/\b(spicy|tikha|teekha|hot|mirchi)\b/.test(q)) {
            filtered = filtered.filter(d => d.spiceLevel === 'spicy');
            filterDescriptions.push('🔥 spicy');
        } else if (/\b(mild|halka|light|plain|bland)\b/.test(q)) {
            filtered = filtered.filter(d => d.spiceLevel === 'mild');
            filterDescriptions.push('🍃 mild');
        } else if (/\b(medium|moderate|normal)\b/.test(q)) {
            filtered = filtered.filter(d => d.spiceLevel === 'medium');
            filterDescriptions.push('🌶️ medium spice');
        }

        // Veg / Non-veg filter
        if (/\b(veg|vegetarian|shakahari)\b/.test(q) && !/\b(non[\s-]?veg|non[\s-]?vegetarian)\b/.test(q)) {
            filtered = filtered.filter(d => d.isVeg === true);
            filterDescriptions.push('🥬 veg');
        } else if (/\b(non[\s-]?veg|non[\s-]?vegetarian|meat|chicken|fish|mutton|maas)\b/.test(q)) {
            filtered = filtered.filter(d => d.isVeg === false);
            filterDescriptions.push('🍖 non-veg');
        }

        // Category filter
        if (/\b(breakfast|nashta|subah)\b/.test(q)) {
            filtered = filtered.filter(d => d.category === 'Breakfast');
            filterDescriptions.push('🌅 breakfast');
        } else if (/\b(lunch|dopahar)\b/.test(q)) {
            filtered = filtered.filter(d => d.category === 'Lunch');
            filterDescriptions.push('☀️ lunch');
        } else if (/\b(dinner|raat|shaam)\b/.test(q)) {
            filtered = filtered.filter(d => d.category === 'Dinner');
            filterDescriptions.push('🌙 dinner');
        } else if (/\b(starter|starters|snack|snacks)\b/.test(q)) {
            filtered = filtered.filter(d => d.category === 'Starter');
            filterDescriptions.push('🍲 starters');
        } else if (/\b(dessert|desserts|sweet|meetha)\b/.test(q)) {
            filtered = filtered.filter(d => d.category === 'Dessert');
            filterDescriptions.push('🍰 dessert');
        }

        // Price filter - "under X", "below X", "X ke andar", "X se kam"
        const priceMatch = q.match(/(?:under|below|within|upto|up to|ke andar|se kam|ke under|tak|budget)\s*(\d+)/);
        const priceMatch2 = q.match(/(\d+)\s*(?:ke andar|se kam|ke under|tak|budget|under|below|rs|rupees|rupay)/);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : (priceMatch2 ? parseInt(priceMatch2[1]) : null);

        if (maxPrice) {
            filtered = filtered.filter(d => d.price <= maxPrice);
            filterDescriptions.push(`💰 under ₹${maxPrice}`);
        }

        // Price range - "between X and Y"
        const rangeMatch = q.match(/(?:between|from)\s*(\d+)\s*(?:to|and|se)\s*(\d+)/);
        if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            filtered = filtered.filter(d => d.price >= min && d.price <= max);
            filterDescriptions.push(`💰 ₹${min} - ₹${max}`);
        }

        if (filterDescriptions.length > 0) {
            if (filtered.length === 0) {
                return `😔 Sorry, no dishes found matching: ${filterDescriptions.join(' + ')}.\n\nTry broadening your search! For example:\n• Increase your budget\n• Try a different spice level\n• Check other categories`;
            }
            return formatDishes(filtered, `🍽️ Dishes matching ${filterDescriptions.join(' + ')}:`);
        }

        // Specific dish search
        const dishSearch = dishes.filter(d => d.title.toLowerCase().includes(q) || q.includes(d.title.toLowerCase()));
        if (dishSearch.length > 0) {
            return formatDishes(dishSearch, "🔍 Found these dishes:");
        }

        // Default response
        return "🤔 I'm not sure I understood that. Try asking me:\n\n• \"Show spicy dishes under 300\"\n• \"Veg options dikhao\"\n• \"Dinner menu\"\n• \"Cheapest dish kaunsi hai?\"\n• \"Recommend something\"\n\nYou can mix and match filters too!";
    };

    const formatDishes = (dishList, header) => {
        let response = header + "\n\n";
        dishList.forEach((dish) => {
            const spiceEmoji = dish.spiceLevel === 'spicy' ? '🔥' : dish.spiceLevel === 'medium' ? '🌶️' : '🍃';
            const vegEmoji = dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg';
            response += `🍽️ **${dish.title}**\n`;
            response += `   💰 ₹${dish.price} | ${spiceEmoji} ${dish.spiceLevel} | ${vegEmoji}\n`;
            response += `   📝 ${dish.description}\n\n`;
        });
        return response.trim();
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const response = processQuery(input);
            setMessages(prev => [...prev, { type: 'bot', text: response }]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const quickActions = [
        { label: '📋 Full Menu', query: 'show full menu' },
        { label: '🔥 Spicy', query: 'spicy dishes' },
        { label: '🥬 Veg', query: 'veg dishes' },
        { label: '💰 Budget', query: 'cheapest dishes' },
    ];

    const handleQuickAction = (query) => {
        setInput(''); // Clear input instead of leaving the query text
        const userMessage = { type: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setTimeout(() => {
            const response = processQuery(query);
            setMessages(prev => [...prev, { type: 'bot', text: response }]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const formatMessage = (text) => {
        // Bold text **text**
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br/>');
        return formatted;
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => isOpen ? handleClose() : setIsOpen(true)}
                id="chatbot-toggle-btn"
            >
                {isOpen ? (
                    <span className="close-icon">✕</span>
                ) : (
                    <span className="chat-icon">🤖</span>
                )}
            </button>

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">🤖</div>
                        <div>
                            <h3>SmartDine AI</h3>
                            <span className="chatbot-status">● Online</span>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={handleClose}>✕</button>
                </div>

                {/* Quick Actions */}
                <div className="chatbot-quick-actions">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            className="quick-action-btn"
                            onClick={() => handleQuickAction(action.query)}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="chatbot-messages" ref={messagesContainerRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`chatbot-message ${msg.type}`}>
                            {msg.type === 'bot' && <div className="bot-avatar">🤖</div>}
                            <div
                                className="message-bubble"
                                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                            />
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chatbot-message bot">
                            <div className="bot-avatar">🤖</div>
                            <div className="message-bubble typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input-area">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask about our menu..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="chatbot-input"
                        id="chatbot-input"
                    />
                    <button
                        className="chatbot-send"
                        onClick={handleSend}
                        disabled={!input.trim()}
                        id="chatbot-send-btn"
                    >
                        <HiOutlineArrowNarrowRight />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
