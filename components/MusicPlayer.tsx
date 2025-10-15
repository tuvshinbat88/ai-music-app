
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MusicTrack } from '../types';

interface MusicPlayerProps {
    track: MusicTrack;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        if (track.audioBuffer) {
            setDuration(track.audioBuffer.duration);
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
        }

        // Cleanup on component unmount or track change
        return () => {
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            }
            cancelAnimationFrame(animationFrameRef.current);
            setIsPlaying(false);
            setProgress(0);
            pauseTimeRef.current = 0;
        };
    }, [track]);

    const updateProgress = useCallback(() => {
        if (isPlaying && audioContextRef.current) {
            const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current + pauseTimeRef.current;
            setProgress(elapsedTime);
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    }, [isPlaying]);


    const play = useCallback(() => {
        if (!audioContextRef.current || !track.audioBuffer) return;

        sourceNodeRef.current = audioContextRef.current.createBufferSource();
        sourceNodeRef.current.buffer = track.audioBuffer;
        sourceNodeRef.current.connect(audioContextRef.current.destination);

        startTimeRef.current = audioContextRef.current.currentTime;
        sourceNodeRef.current.start(0, pauseTimeRef.current % duration);

        sourceNodeRef.current.onended = () => {
            if (progress >= duration - 0.1) { // Check if it ended naturally
                setIsPlaying(false);
                setProgress(0);
                pauseTimeRef.current = 0;
            }
        };

        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
    }, [track.audioBuffer, duration, progress, updateProgress]);

    const pause = useCallback(() => {
        if (!sourceNodeRef.current || !audioContextRef.current) return;
        
        sourceNodeRef.current.stop();
        pauseTimeRef.current += audioContextRef.current.currentTime - startTimeRef.current;
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameRef.current);
    }, []);

    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={track.imageUrl} alt="Album Art" className="w-32 h-32 sm:w-24 sm:h-24 rounded-lg shadow-lg object-cover" />
            <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="font-bold text-xl text-white">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.artist}</p>
                <div className="mt-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={togglePlayPause} className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors duration-200">
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <div className="flex-1 flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
                            <div className="w-full bg-gray-600 rounded-full h-1.5">
                                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(progress / duration) * 100}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
