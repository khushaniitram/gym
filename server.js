import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from api.env in the root workspace folder
dotenv.config({ path: './api.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON middleware
app.use(express.json());

// Serve static assets from root directory
app.use(express.static(__dirname));

// Configuration check endpoint
app.get('/api/config', (req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '';
  res.json({ hasKey });
});

// Proxy AI calls to Groq API using Gemma
app.post('/api/ai', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const modelName = process.env.GROQ_MODEL || 'gemma2-9b-it';
    
    if (!apiKey || apiKey.trim() === '') {
      return res.status(401).json({ 
        error: 'API Key missing', 
        message: 'No Groq API key found in api.env. Please add GROQ_API_KEY=your_key in api.env' 
      });
    }

    const { contents, systemInstruction, jsonMode, temperature } = req.body;
    
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Bad Request', message: 'contents array is required' });
    }

    // Convert contents array (Gemini format) to messages array (Groq/OpenAI format)
    const messages = [];

    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }

    contents.forEach(item => {
      // Map role: 'model' -> 'assistant', 'user' -> 'user'
      let role = item.role || 'user';
      if (role === 'model') {
        role = 'assistant';
      }
      
      // Extract text from parts array
      const text = item.parts && Array.isArray(item.parts) 
        ? item.parts.map(p => p.text).join('\n')
        : (typeof item.text === 'string' ? item.text : '');

      messages.push({ role: role, content: text });
    });

    const requestBody = {
      model: modelName,
      messages: messages
    };

    if (jsonMode) {
      requestBody.response_format = { type: 'json_object' };
    }
    
    if (temperature !== undefined) {
      requestBody.temperature = temperature;
    } else {
      requestBody.temperature = 0.2; // Low temperature for factual structures
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson = {};
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {}
      return res.status(response.status).json({
        error: 'Groq API Error',
        message: errorJson.error?.message || errorText || 'Failed to call Groq API'
      });
    }

    const data = await response.json();
    const contentText = data.choices[0].message.content;

    return res.json({ text: contentText });
  } catch (error) {
    console.error('Server error processing Groq request:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Fallback to index.html for single page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Groq Key in api.env: ${process.env.GROQ_API_KEY ? 'Configured' : 'NOT Configured (Add to api.env)'}`);
  console.log(`Groq Model: ${process.env.GROQ_MODEL || 'gemma2-9b-it'}`);
});
