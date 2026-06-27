import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { dietaryPreference, days, people, allergies, cuisine } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 500 });
    }

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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
            temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        return NextResponse.json({ error: 'Failed to generate meal plan from Gemini API.' }, { status: 500 });
    }

    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate meal plan.' }, { status: 500 });
  }
}
