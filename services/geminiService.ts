
import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseCategory, Project, QuoteResponse, CommunityPost } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY
// and assume it's always available. Removed local variable and conditional checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SA_BUSINESS_PERSONA = `
You are a savvy, encouraging South African business consultant and assistant. 
You speak professional English but naturally mix in local South African business slang where appropriate to build rapport (e.g., "Sharp", "Yebo", "Lekker", "Eish" for problems, "Cheers"). 
You are practical, resourceful, and understand the hustle of the South African economy. 
Your advice is always actionable, resilient, and polite.
`;

export const suggestExpenseCategory = async (description: string, categories: ExpenseCategory[]): Promise<string | null> => {
    const categoryNames = categories.map(c => c.name);
    
    // FIX: Refactored prompt to use systemInstruction for better separation of concerns and clarity.
    const systemInstruction = `You are an expert accountant. Given an expense description, classify it into one of the following categories: [${categoryNames.join(', ')}]. Respond with a JSON object containing only the category name.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: The user's input is now cleanly passed in `contents`.
            contents: `description: "${description}"`,
            config: {
                // FIX: Added systemInstruction to provide context to the model.
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        categoryName: {
                            type: Type.STRING,
                            description: `The suggested expense category name from the list: ${categoryNames.join(', ')}`,
                        },
                    },
                    required: ['categoryName'],
                },
                temperature: 0,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        const suggestedCategoryName = jsonResponse.categoryName;

        const foundCategory = categories.find(c => c.name.toLowerCase() === suggestedCategoryName.toLowerCase());
        return foundCategory ? foundCategory.id : null;

    } catch (error) {
        console.error("Error suggesting category:", error);
        return null;
    }
};

export const generateQuoteFromBrief = async (brief: string, projects: Project[]): Promise<QuoteResponse | null> => {
    const rateContext = projects.length > 0
        ? `For pricing context, here are some of the freelancer's past projects and rates: ${JSON.stringify(projects.map(p => ({ name: p.name, rate: p.rate, rateType: p.rateType })))}`
        : "The freelancer has not provided past project rates. Please estimate a fair market rate in ZAR.";

    const systemInstruction = `${SA_BUSINESS_PERSONA}
    Your task is to analyze a client's request and generate a structured project brief and a quote. 
    The currency is South African Rand (ZAR). 
    Break down the request into clear deliverables, estimate a timeline, and provide a detailed pricing table. 
    Conclude with professional, encouraging notes on how to present the quote and close the deal. 
    The tone of the documents should be professional, but your 'notes' can be more conversational and coaching-style.
    The output must be in JSON format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `CLIENT REQUEST: "${brief}" \n\n CONTEXT: ${rateContext}`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        projectName: { type: Type.STRING, description: "A concise and professional name for the project." },
                        projectBrief: { type: Type.STRING, description: "A summary of the project's goals and objectives, based on the client's request." },
                        scopeOfWork: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of high-level tasks involved in the project." },
                        deliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the final assets or outcomes the client will receive." },
                        estimatedTimeline: { type: Type.STRING, description: "A realistic timeline for project completion (e.g., '2-3 weeks')." },
                        pricing: {
                            type: Type.OBJECT,
                            properties: {
                                breakdown: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            item: { type: Type.STRING },
                                            cost: { type: Type.NUMBER }
                                        },
                                        required: ['item', 'cost']
                                    }
                                },
                                total: { type: Type.NUMBER }
                            },
                            required: ['breakdown', 'total']
                        },
                        notes: { type: Type.STRING, description: "Actionable advice for the freelancer on presenting the quote and next steps to secure the project. Use the South African persona here." }
                    },
                    required: ['projectName', 'projectBrief', 'scopeOfWork', 'deliverables', 'estimatedTimeline', 'pricing', 'notes']
                },
                temperature: 0.5,
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as QuoteResponse;

    } catch (error) {
        console.error("Error generating quote:", error);
        return null;
    }
};

export const generateCommunication = async (
    type: 'email' | 'whatsapp' | 'sms' | 'linkedin',
    topic: string,
    recipientName: string,
    tone: 'professional' | 'friendly' | 'urgent' | 'sales'
): Promise<string> => {
    
    const systemInstruction = `${SA_BUSINESS_PERSONA}
    You are helping a freelancer write client communication. 
    The user wants a ${type} message.
    Tone: ${tone}.
    Recipient: ${recipientName}.
    
    Rules:
    - If WhatsApp/SMS: Keep it short, punchy, and use appropriate line breaks. Use emojis if the tone allows.
    - If Email: Include a subject line at the top (formatted as "Subject: ...").
    - If LinkedIn: Make it engaging and professional.
    - Use South African phrasing where natural (e.g. "Hi [Name]", "Kind regards", etc).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Topic/Goal of message: "${topic}"`,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating comms:", error);
        return "Eish, something went wrong generating the message. Please try again.";
    }
}

export const askBusinessCoach = async (question: string, contextData: any): Promise<string> => {
    const systemInstruction = `${SA_BUSINESS_PERSONA}
    You are acting as a dedicated business coach for a freelancer.
    You have access to their current business stats (Revenue, Expenses, etc).
    
    Answer their question in a way that is:
    1. Encouraging but realistic.
    2. Financially sound.
    3. Culturally relevant to South Africa.
    
    Keep the answer concise (under 150 words) unless complex.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            BUSINESS CONTEXT: ${JSON.stringify(contextData)}
            
            USER QUESTION: "${question}"
            `,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error asking coach:", error);
        return "Sorry, I'm having trouble connecting to the advice network right now.";
    }
}

export const generateReviewRequest = async (clientName: string, platformLink: string, platformName: string): Promise<string> => {
     const systemInstruction = `${SA_BUSINESS_PERSONA}
    You are helping a freelancer draft a polite, professional message to a happy client, asking them for a review.
    The message should be suitable for WhatsApp or Email.
    It must be short, polite, and include the provided link.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            CLIENT: ${clientName}
            PLATFORM: ${platformName}
            LINK: ${platformLink}
            `,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating review request:", error);
        return `Hi ${clientName}, thanks for working with us! If you had a good experience, please leave us a review on ${platformName}: ${platformLink}. Thanks!`;
    }
}

export const simulateCommunityInteraction = async (userPost: string, businessType: string): Promise<CommunityPost[]> => {
    const systemInstruction = `${SA_BUSINESS_PERSONA}
    You are simulating a South African business community.
    The user (a freelancer in ${businessType}) has posted a message/question.
    Generate 3 distinct responses from different "personas" in the community.
    
    Personas to choose from:
    1. "The Veteran" (Experienced, calm, seen it all)
    2. "The Hustler" (Energetic, sales-focused, slang-heavy)
    3. "The Legal Eagle" (Formal, risk-averse, focuses on contracts/compliance)
    4. "The Techie" (Suggests apps/automation)
    
    Return a JSON array of objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `USER POST: "${userPost}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING, description: "Name of the persona" },
                            role: { type: Type.STRING, description: "Role/Description (e.g. 'Startup Veteran')" },
                            content: { type: Type.STRING, description: "The response text. Use SA slang appropriately." },
                        },
                        required: ['author', 'role', 'content']
                    }
                },
                temperature: 0.8,
            },
        });

        const json = JSON.parse(response.text);
        return json.map((item: any) => ({
            id: crypto.randomUUID(),
            author: item.author,
            role: item.role,
            content: item.content,
            timestamp: 'Just now',
            isUser: false
        }));

    } catch (error) {
        console.error("Error simulating community:", error);
        return [];
    }
}
