
import React from 'react';

const loadingMessages = [
    "Warming up the synthesizers...",
    "Tuning the virtual instruments...",
    "Composing the digital symphony...",
    "Teaching the AI to drop a beat...",
    "Polishing the final mix...",
    "Writing the sheet music in binary...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700">
            <div className="flex space-x-2">
                <div className="w-3 h-8 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-8 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-8 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-8 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-gray-300 font-medium transition-opacity duration-500">{message}</p>
            <p className="text-xs text-gray-400 text-center">AI is hard at work. This can take a moment.</p>
        </div>
    );
};
