import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    // Initialize inside the request to ensure environment variables are loaded
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION
    });

    const { dietaryPreference, days, people, allergies, cuisine } = await req.json();

    const prompt = `You're a senior fullstack engineer. Your sole job is to build a personal cooking to-do list based on their day. 
The response should generate a:
1. meal plan - Breakfast/lunch/dinner
2. Grocery list  
3. substitutions
4. budget feasibility logic 

User input:
1. dietary preference: ${dietaryPreference || 'general'}
2. number of days: ${days || 1}
3. number of people: ${people || 1}
4. Allergies: ${allergies || 'none'}
5. Cuisine preference: ${cuisine || 'general'}

Please respond in JSON format with the following structure:
{
  "mealPlan": [
    { "day": 1, "breakfast": "...", "lunch": "...", "dinner": "..." }
  ],
  "groceryList": ["item 1", "item 2"],
  "substitutions": ["sub 1", "sub 2"],
  "budgetFeasibility": "explanation of budget logic"
}
Do not use markdown blocks (\`\`\`json) for the JSON output. Just output the raw JSON string.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    let text = response.text;
    if (!text) {
        throw new Error('No content returned from model');
    }
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate meal plan.' }, { status: 500 });
  }
}
