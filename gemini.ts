
import { GoogleGenAI, Modality, Type } from "@google/genai";

export const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please set it in Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanTextForTTS = (text: string): string => {
  const armenianRegex = /[\u0530-\u058F]+/g;
  const matches = text.match(armenianRegex);
  return matches ? matches.join(' ') : text.replace(/\([^)]*\)/g, '').trim();
};

export const generateSpeech = async (text: string) => {
  try {
    const ai = getGeminiClient();
    const cleanedText = cleanTextForTTS(text);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${cleanedText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const evaluateUserSpeech = async (audioBase64: string, expectedText: string, lang: string) => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      contents: {
        parts: [
          { inlineData: { mimeType: "audio/wav", data: audioBase64 } },
          { text: `Evaluate Armenian pronunciation of "${expectedText}". Respond in ${lang} JSON: {score: number, feedback: string}.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Speech Evaluation Error:", error);
    return { score: 70, feedback: "Keep trying!" };
  }
};

export const generateAIDynamicLesson = async (topic: string, lang: string) => {
  try {
    const ai = getGeminiClient();
    const prompt = `Create an Armenian lesson for "${topic}" (Interface: ${lang}). 
    Include these exercise types: EXPLANATION, MULTIPLE_CHOICE, MATCHING, FILL_IN_BLANKS, UNSCRAMBLE, SPEAKING.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              armenianText: { type: Type.STRING },
              translation: { type: Type.STRING },
              explanation: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              sentenceWithBlank: { type: Type.STRING },
              unscrambleWords: { type: Type.ARRAY, items: { type: Type.STRING } },
              pairs: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { left: { type: Type.STRING }, right: { type: Type.STRING } } 
                } 
              }
            },
            required: ["id", "type", "question", "correctAnswer"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    return null;
  }
};
