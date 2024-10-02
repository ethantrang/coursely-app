"use client"

import React, { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Message = {
    sender: 'ai' | 'user'
    content: string
}

export default function ChatbotInterface() {

    const questions = [
        "what is your current job title?",
        "how many years of experience do you have?",
        "what key skills are you looking to develop?",
        "what are your career goals?",
    ]

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', content: questions[0] },
    ])
    const [userInput, setUserInput] = useState('')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isAIResponding, setIsAIResponding] = useState(false);

    const handleUserInput = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && userInput.trim() !== '' && !isAIResponding) {
            e.preventDefault(); // Prevent default newline on Enter
            const userMessage = { sender: 'user' as 'user', content: userInput.trim() };
            setMessages((prev) => [...prev, userMessage]);
            setChatHistory((prev) => [...prev, userMessage]);
            setUserInput('');
            setIsAIResponding(true); // AI is now responding

            const nextQuestionIndex = currentQuestionIndex + 1;

            try {
                // Start AI loading message
                const loadingMessage: Message = { sender: 'ai', content: '' };
                setMessages((prev) => [...prev, loadingMessage]);

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: userInput.trim(), chatHistory }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let aiResponse = '';

                // Stream AI response
                while (true) {
                    const { done, value } = await reader!.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiResponse += chunk;

                    // Update AI message incrementally as the stream arrives
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[updatedMessages.length - 1] = {
                            sender: 'ai',
                            content: aiResponse,
                        };
                        return updatedMessages;
                    });
                }

                // After the AI response finishes, stream the next question on a new line
                if (nextQuestionIndex < questions.length) {
                    let questionStream = '';

                    for (let i = 0; i < questions[nextQuestionIndex].length; i++) {
                        await new Promise((resolve) => setTimeout(resolve, 10)); // 2x faster streaming effect

                        questionStream += questions[nextQuestionIndex][i];

                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = {
                                sender: 'ai',
                                content: aiResponse + '\n\n' + questionStream, // Append the question to the AI response on a new line
                            };
                            return updatedMessages;
                        });
                    }

                    setCurrentQuestionIndex(nextQuestionIndex);
                } else {
                    const finalMessage = "\nThank you for answering all the questions!";
                    let finalMessageStream = '';

                    for (let i = 0; i < finalMessage.length; i++) {
                        await new Promise((resolve) => setTimeout(resolve, 25)); // 2x faster streaming effect

                        finalMessageStream += finalMessage[i];

                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = {
                                sender: 'ai',
                                content: aiResponse + '\n' + finalMessageStream, // Append final message to AI response on a new line
                            };
                            return updatedMessages;
                        });
                    }
                }

                setIsAIResponding(false); // AI has finished responding, allow user input
            } catch (error) {
                console.error('Error fetching AI response:', error);
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1), // Remove the loading message
                    { sender: 'ai', content: 'Sorry, something went wrong.' },
                ]);
                setIsAIResponding(false); // Allow user input in case of error
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-orange"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <nav className="hidden md:flex space-x-4">
                        <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
                            Courses
                        </Link>
                        <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
                            About Us
                        </Link>
                        <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
                            Contact
                        </Link>
                    </nav>
                </div>
                <Button variant="secondary" className="text-sm font-medium text-black">
                    Share
                </Button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 flex flex-col items-center justify-start">

                <h1 className="text-xl font-medium text-charcoal mb-8">Discover your strategic development path</h1>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className="mb-6 w-full max-w-lg" // Increased margin-bottom here
                    >
                        <div className="flex items-center mb-1">
                            <div
                                className={`w-2 h-2 rounded-full mr-2 ${message.sender === 'ai' ? 'bg-[#fc8c07]' : 'bg-[#5d5d5d]'
                                    }`}
                            />
                            <span className="text-xl text-[#5d5d5d]">
                                {message.sender === 'ai' ? 'ai chatbot' : 'you'}
                            </span>
                        </div>
                        <p className="ml-4 text-left text-xl whitespace-pre-line">{message.content}</p> {/* whitespace-pre-line to preserve new lines */}
                    </div>
                ))}

                {/* Only show input when AI has finished responding */}
                {!isAIResponding && (
                    <div className="mb-4 w-full max-w-lg">
                        <div className="flex items-center mb-1">
                            <div className="w-2 h-2 rounded-full mr-2 bg-[#5d5d5d]" />
                            <span className="text-xl text-[#5d5d5d]">you</span>
                        </div>
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleUserInput}
                            placeholder="Type your answer here..."
                            rows={5} // Default rows height
                            className="ml-4 w-full outline-none text-gray-700 placeholder-gray-500 text-left text-xl resize-none overflow-hidden"
                            style={{ resize: 'none' }}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
