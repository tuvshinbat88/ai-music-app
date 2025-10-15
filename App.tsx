
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { MusicPlayer } from './components/MusicPlayer';
import { Loader } from './components/Loader';
import { generateAudioFromText, generateMusicDescription } from './services/geminiService';
import type { MusicTrack } from './types';
import { Toast } from './components/Toast';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A synthwave track with a driving beat, inspired by 80s sci-fi movies.');
    const [lyrics, setLyrics] = useState<string>('Neon lights flicker in the rain\nAnother night, the city calls my name\nLost in the code, a digital ghost\nSearching for a signal I lost the most.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [track, setTrack] = useState<MusicTrack | null>(null);

    const handleGenerateMusic = useCallback(async () => {
        if (!prompt && !lyrics) {
            setError('Please provide a prompt or lyrics to generate music.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTrack(null);

        try {
            const description = await generateMusicDescription(prompt, lyrics);
            const audioBuffer = await generateAudioFromText(description);

            setTrack({
                title: prompt || 'AI Generated Track',
                artist: 'Gemini AI',
                audioBuffer: audioBuffer,
                imageUrl: `https://picsum.photos/seed/${Date.now()}/500/500`,
                description: description,
            });
        } catch (err) {
            console.error('Error generating music:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, lyrics]);

    return (
        <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans overflow-hidden antialiased">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                            AI Music Generator
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Describe the music, write your lyrics, and let AI create a spoken-word performance.
                        </p>
                    </div>

                    <PromptInput
                        prompt={prompt}
                        setPrompt={setPrompt}
                        lyrics={lyrics}
                        setLyrics={setLyrics}
                        onSubmit={handleGenerateMusic}
                        isLoading={isLoading}
                    />

                    {isLoading && <Loader />}
                    
                    {!isLoading && track && (
                        <div className="animate-fade-in">
                           <MusicPlayer track={track} />
                        </div>
                    )}
                </div>
            </main>
            {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default App;
