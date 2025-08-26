import { GoogleGenAI, Type } from '@google/genai';
import type { Opportunity, AIRecommendation } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const MOCK_API_DELAY = 1500;

// Mock function for when API_KEY is not available
const getMockOpportunityMatches = (profile: string, opportunities: Opportunity[]): Promise<AIRecommendation[]> => {
    console.log("Using Mock Gemini Service for Matches");
    return new Promise(resolve => {
        setTimeout(() => {
            // Simple mock logic: return a few random opportunity IDs with rationales
            const shuffled = [...opportunities].sort(() => 0.5 - Math.random());
            const matches = shuffled.slice(0, 3).map(o => ({
                id: o.id,
                rationale: `This mock match for '${o.title}' is recommended because it aligns with the skills and interests mentioned in your profile.`
            }));
            resolve(matches);
        }, MOCK_API_DELAY);
    });
};

export const getOpportunityMatches = async (profile: string, opportunities: Opportunity[]): Promise<AIRecommendation[]> => {
    if (!process.env.API_KEY) {
        return getMockOpportunityMatches(profile, opportunities);
    }
    
    const simplifiedOpportunities = opportunities.map(({ id, title, description, category }) => ({ id, title, description, category }));

    const prompt = `
      As an expert career advisor for African youth, your task is to match a user's profile with a list of available opportunities.
      Analyze the user's profile and the provided list of opportunities.
      Return a JSON object containing a single key "matches". The value of "matches" should be an array of objects, with each object representing one of the top 3 most relevant opportunities.
      Each object in the array must have two keys:
      1. "id": The numerical ID of the opportunity.
      2. "rationale": A brief, one-sentence explanation of why this opportunity is a good match for the user's profile.
      Do not include any opportunities that are a poor match.

      USER PROFILE:
      ---
      ${profile}
      ---

      AVAILABLE OPPORTUNITIES (JSON):
      ---
      ${JSON.stringify(simplifiedOpportunities, null, 2)}
      ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matches: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.NUMBER },
                                    rationale: { type: Type.STRING }
                                },
                                required: ['id', 'rationale']
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && Array.isArray(result.matches)) {
            return result.matches;
        } else {
            console.error("Invalid JSON structure received from Gemini:", result);
            return [];
        }

    } catch (error) {
        console.error("Error calling Gemini API for matching:", error);
        throw new Error("Failed to fetch matches from AI service.");
    }
};

// Mock function for content generation
const getMockGeneratedContent = (prompt: string): Promise<string> => {
    console.log("Using Mock Gemini Service for Content Generation");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("This is mock generated content based on your request. In a real scenario, this would be a tailored response from the AI to help with your application. It would include key points, suggested phrasing, and tips specific to the opportunity you selected.");
        }, MOCK_API_DELAY);
    });
};


export const generateApplicationContent = async (
    opportunity: Opportunity, 
    userProfile: string, 
    contentType: 'CV' | 'Letter' | 'Proposal'
): Promise<string> => {
     if (!process.env.API_KEY) {
        return getMockGeneratedContent(`Generate content for ${contentType}`);
    }

    let prompt = `
        You are an expert career coach assisting African youth with their applications.
        Based on the user's profile and the specific opportunity details provided, generate helpful content.
        The response should be clear, concise, and encouraging. Use markdown for formatting.

        USER PROFILE:
        ---
        ${userProfile || "No profile provided. Provide general advice."}
        ---

        OPPORTUNITIES DETAILS:
        ---
        Title: ${opportunity.title}
        Organization: ${opportunity.organization}
        Description: ${opportunity.description}
        Category: ${opportunity.category}
        ---
    `;

    switch (contentType) {
        case 'CV':
            prompt += `
                TASK: Generate 3-5 key bullet points on how to tailor a CV for this specific opportunity. Focus on skills and experiences to highlight.
            `;
            break;
        case 'Letter':
            prompt += `
                TASK: Draft an outline for a motivation letter for this opportunity. Include an introduction, 2-3 body paragraphs with key themes to address, and a conclusion.
            `;
            break;
        case 'Proposal':
            prompt += `
                TASK: Create a basic structure for a project proposal relevant to this opportunity. Include sections like 'Problem Statement', 'Proposed Solution', 'Objectives', and 'Expected Impact'.
            `;
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error calling Gemini API for ${contentType} generation:`, error);
        throw new Error(`Failed to generate ${contentType} content from AI service.`);
    }
};