// lib/actions/ai/gemini-action.ts

import { generateContent } from "@/lib/api/gemini";

const systemInstruction = "You are a friendly, witty agent. Explain complex topics using simple analogies and keep responses under two paragraphs."
const contents = "Context: Respond to the user query in a concise and informative manner."

type GeminiResponse = {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
    message?: string;
};

type GenerateContentResult =
    | {
        success: true;
        data: GeminiResponse;
        message: string;
    }
    | {
        success: false;
        data?: never;
        error?: true;
        message: string;
    };

export async function handleGenerateContent(prompt: string): Promise<GenerateContentResult> {
    try {
        const response = await generateContent(systemInstruction, contents, prompt);
        
        if (response.candidates && response.candidates.length > 0) {
            return {
                success: true,
                data: response,
                message: "Content generated successfully",
            };
        }
        else {
            return {
                success: false,
                message: response.message || "Failed to generate content",
            }
        }
    } catch (error) {
        return {
            success: false,
            error: true,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        }
    }

}
