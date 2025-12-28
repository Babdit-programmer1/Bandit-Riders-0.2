import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { model, contents, config } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: API_KEY missing' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We strictly use generateContent here as the client expects text generation
    const response = await ai.models.generateContent({
      model: model || "gemini-3-flash-preview",
      contents,
      config
    });

    // The client expects the text. getter 'text' isn't serialized automatically in JSON,
    // so we extract it explicitly.
    const text = response.text;
    
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content', 
      details: error.message 
    });
  }
}