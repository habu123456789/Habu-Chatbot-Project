
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to show a graceful error to the user
  // For this example, we throw an error to halt execution.
  throw new Error("API_KEY environment variable not set. Please add it to your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chatSession: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: SYSTEM_INSTRUCTION,
  },
});

export const sendMessageToHabu = async (message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Re-throw the error to be handled by the UI component
    throw new Error("Failed to get response from Gemini API.");
  }
};
