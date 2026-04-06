/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { PrescriptionItem } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey as string });

export async function parsePrescription(base64Image: string): Promise<PrescriptionItem[]> {
  // Use gemini-flash-latest as it's the recommended stable model for multimodal tasks.
  const modelName = "gemini-flash-latest"; 
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        parts: [
          {
            text: `Extract medicines and exercises from this prescription image. 
            Return a JSON array of objects with these properties:
            - type: "medicine" or "exercise"
            - name: string
            - dosage: string (optional)
            - frequency: string (e.g., "twice a day")
            - timing: string[] (e.g., ["morning", "evening"])
            - duration: string (optional)
            - instructions: string (optional)
            
            Be precise. If it's a medicine, include dosage. If it's an exercise, include sets/reps in instructions.`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["medicine", "exercise"] },
            name: { type: Type.STRING },
            dosage: { type: Type.STRING },
            frequency: { type: Type.STRING },
            timing: { type: Type.ARRAY, items: { type: Type.STRING } },
            duration: { type: Type.STRING },
            instructions: { type: Type.STRING },
          },
          required: ["type", "name", "frequency", "timing"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return [];
  }
}

export async function getMotivationalQuote(): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: "Give me a short, powerful motivational quote for someone recovering from an injury or illness. Maximum 15 words.",
  });
  return response.text?.trim() || "Keep pushing, you're doing great!";
}

export async function analyzePainPatterns(logs: any[]): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Analyze these pain logs and provide a brief summary of patterns or anomalies: ${JSON.stringify(logs)}`,
  });
  return response.text?.trim() || "No significant patterns identified yet.";
}
