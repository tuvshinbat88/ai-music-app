
import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
    lyrics: string;
    setLyrics: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, lyrics, setLyrics, onSubmit, isLoading }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-6 border border-gray-700">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Describe the Music
                </label>
                <input
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Lofi hip hop, chill, and relaxing"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="lyrics" className="block text-sm font-medium text-gray-300 mb-2">
                    Add Lyrics (Optional)
                </label>
                <textarea
                    id="lyrics"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    rows={5}
                    placeholder="In the twilight's gentle hum..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-y"
                    disabled={isLoading}
                />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                               <path d="M10 3.5a.75.75 0 01.75.75v1.558l1.623-1.623a.75.75 0 111.06 1.06l-1.623 1.623V8.25a.75.75 0 01-1.5 0V6.707L9.31 8.33a.75.75 0 11-1.06-1.06l1.623-1.623V4.25A.75.75 0 0110 3.5zM10 16.5a.75.75 0 01-.75-.75v-1.558l-1.623 1.623a.75.75 0 11-1.06-1.06l1.623-1.623V11.75a.75.75 0 111.5 0v1.543l1.69-1.623a.75.75 0 111.06 1.06L11.5 14.293V15.75a.75.75 0 01-.75.75z" />
                            </svg>
                            Generate Music
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
