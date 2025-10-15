
import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error('API_KEY environment variable not set');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
let outputAudioContext: AudioContext | null = null;

// Helper to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const generateMusicDescription = async (prompt: string, lyrics: string): Promise<string> => {
    const fullPrompt = `
        You are a creative director for spoken-word audio performances.
        Your task is to take a user's musical idea and lyrics and transform them into a descriptive script for a voice actor.
        The script should not just be the lyrics, but a creative interpretation that describes the mood, rhythm, and imaginary instrumentation.
        
        User's Musical Idea: "${prompt}"
        User's Lyrics:
        ---
        ${lyrics}
        ---
        
        Generate a script for a text-to-speech engine to read. The script should be evocative and rhythmic.
        For example, if the user wants a synthwave track, you might describe the sound of synthesizers and drum machines before and during the lyrics.
        
        Here is an example output format:
        "(Sound of a deep, pulsing synthesizer bassline begins, with a slow, steady 80s drum machine beat. Retro pads swell in the background.)
        (Voice speaks with a cool, slightly detached tone)
        Neon lights flicker in the rain...
        (A high-pitched synth melody plays a short, melancholic riff)
        Another night, the city calls my name...
        (Beat becomes more intense)
        Lost in the code... a digital ghost..."
        
        Now, generate the creative script based on the user's input.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating music description:', error);
        throw new Error('Failed to generate music description from Gemini.');
    }
};

export const generateAudioFromText = async (text: string): Promise<AudioBuffer> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: `Say with a rhythmic, performative tone: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A versatile voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error('No audio data received from the API.');
        }

        if (!outputAudioContext) {
            outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, outputAudioContext, 24000, 1);
        
        return audioBuffer;

    } catch (error) {
        console.error('Error generating audio:', error);
        throw new Error('Failed to generate audio from text.');
    }
};
