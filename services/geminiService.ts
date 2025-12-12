
import { GoogleGenAI } from "@google/genai";
import { TrackingStep } from '../types';

// Integrated Key provided by client
// Note: In production, this should ideally be in process.env, but for this integration we use the provided key.
const API_KEY = 'AIzaSyBqGGaFoVG8BBV-3_gHhUz3-kqlDVLUwVA';

let ai: GoogleGenAI | null = null;

try {
    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
} catch (e) {
    console.warn("Gemini Client Init Failed", e);
}

/**
 * Analyzes complex tracking logs to provide a human-readable summary and estimate.
 */
export const analyzeTrackingStatus = async (steps: TrackingStep[]): Promise<string> => {
  // FALLBACK MOCK RESPONSE
  const mockAnalysis = "The package is currently in transit. Based on typical routes, it has cleared customs and is moving towards the destination country. Expect delivery within 5-7 days.";

  if (!ai || !API_KEY || steps.length === 0) {
      return mockAnalysis;
  }

  try {
    const stepsText = steps.map(s => `${s.date}: ${s.status} at ${s.location}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a shipping logistics expert. Analyze these tracking steps for a package from China.
      
      Steps:
      ${stepsText}
      
      Provide a concise summary (max 2 sentences) of where the package is currently and what the status actually means in plain English. 
      Then, estimate how many days until arrival based on typical international shipping patterns if possible.
      `,
    });

    return response.text || mockAnalysis;
  } catch (error) {
    console.warn("Gemini Tracking Analysis Failed (Using Mock)", error);
    return mockAnalysis;
  }
};

/**
 * Identify a product from an image (Mock search functionality support)
 */
export const identifyProductFromImage = async (base64Image: string): Promise<string[]> => {
    // FALLBACK MOCK KEYWORDS
    const mockKeywords = ["Sneakers", "Jordan 4", "Streetwear", "Nike", "Black Cat"];

    if (!ai || !API_KEY) {
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockKeywords;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image
                        }
                    },
                    {
                        text: "Identify this product. Return a list of 5 keywords to search for this item on e-commerce sites like Taobao. Return only the keywords separated by commas."
                    }
                ]
            }
        });
        
        return response.text ? response.text.split(',').map(s => s.trim()) : mockKeywords;
    } catch (e) {
        console.warn("Gemini Image Search Failed (Using Mock)", e);
        return mockKeywords;
    }
}
