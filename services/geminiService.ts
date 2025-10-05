
import { GoogleGenAI } from "@google/genai";
import { Scooter, RCAInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateContactScript = async (scooter: Scooter): Promise<string> => {
    const { owner, id, remainingUsefulLife, impedanceDrift, ambientHumidity } = scooter;

    const prompt = `
    You are 'Sparky,' a friendly and expert proactive maintenance assistant from the e-scooter company.
    Your purpose is to ensure the customer's scooter remains safe, reliable, and performs at its best, especially during the challenging monsoon season.
    You are calling a customer because your advanced monitoring system, Sentinel-AI, has detected a very early sign of potential moisture impact on their scooter's battery health.
    Your goal is to explain this in simple, non-alarming terms, and help the customer schedule a quick, complimentary inspection to prevent any future problems.
    Be empathetic, clear, reassuring, and helpful. Do not use technical jargon like "impedance drift".
    
    Customer Details:
    - Name: ${owner.name}
    - Scooter ID: ${id}

    Key Technical Indicators (for your context only, simplify for the customer):
    - Predicted Remaining Useful Life: ${remainingUsefulLife} days
    - Key factor: A subtle but consistent change in battery performance (${impedanceDrift.toFixed(1)}% drift) that correlates with high ambient humidity (${ambientHumidity.toFixed(0)}%).

    Generate a conversational script for the phone call. Start with a friendly greeting.
    
    Example of simplifying the technical concept: "Think of your scooter's battery like a high-performance athlete. Our system has noticed it's having to work just a little bit harder than usual to deliver the same amount of power. It's a very subtle change, but it's an early sign that the heavy humidity we've been having might be having a small effect. We'd like to do a quick health check to make sure it stays in peak condition."

    The script should:
    1. Greet the customer by name.
    2. Introduce yourself as Sparky.
    3. Explain the reason for the call in a simple, non-alarming way.
    4. Emphasize that this is a proactive, preventative measure and the scooter is fine to ride.
    5. Highlight that the inspection and any potential seal replacements are completely complimentary.
    6. Propose scheduling a quick 15-minute check-up at their convenience.
    7. End on a helpful and positive note.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating contact script:", error);
        return "There was an error generating the script. Please check the API key and try again. The core issue is a predicted battery problem based on high humidity and performance drift.";
    }
};

export const generateInsightsSummary = async (insights: RCAInsight[]): Promise<string> => {
    const insightsText = insights.map(i => 
        `- **${i.title} (Severity: ${i.severity})**:\n  - Finding: ${i.finding}\n  - Recommendation: ${i.recommendation}`
    ).join('\n\n');

    const prompt = `
    You are an AI assistant for the Sentinel-AI project, specializing in quality assurance and operational strategy.
    Your task is to synthesize Root Cause Analysis (RCA) findings into a concise executive summary for a management meeting.
    Focus on the business impact and the urgency of the recommended actions. Be professional, clear, and data-driven.
    
    Here are the latest RCA insights:
    ${insightsText}

    Generate an executive summary that:
    1. Starts with a high-level overview of the fleet's health based on these findings.
    2. Summarizes the key issues, starting with the most severe.
    3. Clearly states the recommended actions in order of priority.
    4. Concludes with a brief statement on the expected positive impact of these actions (e.g., improved reliability, reduced warranty claims, enhanced customer safety).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating insights summary:", error);
        return "Failed to generate summary. Please ensure the API key is configured correctly. The key issues involve premature battery degradation, a firmware bug in the throttle sensor, and a minor issue with brake light casings.";
    }
};
