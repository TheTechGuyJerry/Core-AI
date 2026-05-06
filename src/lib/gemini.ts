import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export async function chat(messages: Message[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const latestMessage = messages[messages.length - 1];
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model' as any,
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: latestMessage.content }] }
      ],
      config: {
        systemInstruction: "You are a helpful, intelligent AI assistant. Your goal is to provide accurate, concise, and professional responses. Use markdown for formatting, especially for code blocks, lists, and emphasis.",
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function* chatStream(messages: Message[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const latestMessage = messages[messages.length - 1];
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model' as any,
    parts: [{ text: msg.content }]
  }));

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: latestMessage.content }] }
      ],
      config: {
        systemInstruction: "You are a helpful, intelligent AI assistant. Your goal is to provide accurate, concise, and professional responses. Use markdown for formatting, especially for code blocks, lists, and emphasis.",
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Stream Error:", error);
    throw error;
  }
}
