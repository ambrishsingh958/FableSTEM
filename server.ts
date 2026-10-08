import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// In-memory rate limiting (max 30 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function rateLimiter(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests. Please pause a moment before generating another story or quiz.'
    });
  }

  entry.count++;
  next();
}

// Child safety keywords check
const UNSAFE_KEYWORDS = [
  'kill', 'murder', 'suicide', 'bomb', 'weapon', 'gun', 'porn', 'sex', 'nude',
  'terrorist', 'drug', 'cocaine', 'heroin', 'meth', 'poison', 'torture', 'blood',
  'abuse', 'profanity', 'hate', 'racist', 'slur', 'assault', 'violence', 'gamble',
  'alcohol', 'beer', 'whiskey', 'cigarette', 'vape'
];

function isUnsafeTopic(topic: string): boolean {
  const normalized = topic.toLowerCase();
  return UNSAFE_KEYWORDS.some(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(normalized);
  });
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient AI generation helper with model fallback and JSON retry
async function generateJsonWithFallback(prompt: string, systemInstruction: string, temp: number = 0.7): Promise<any> {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: temp,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        try {
          return JSON.parse(rawText);
        } catch {
          // Extract JSON block if surrounded by markdown or extra text
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            return JSON.parse(match[0]);
          }
          throw new Error('AI returned non-JSON text');
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt + 1} with ${model} failed:`, err?.message);
      }
    }
  }

  throw lastError || new Error('AI generation temporarily busy. Please try again!');
}

// Health Check
app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.json({ ok: true, status: 'Story Teacher Service Operational' });
});

// Endpoint: Generate Story
app.post('/api/story', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic, age_group, language = 'English', length = 'medium' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a learning topic!' });
    }

    if (topic.trim().length > 100) {
      return res.status(400).json({ error: 'Topic is too long (maximum 100 characters).' });
    }

    if (isUnsafeTopic(topic)) {
      return res.status(400).json({
        error: 'unsafe',
        message: 'Let’s choose a safer learning topic! Try science, nature, history, friendship, space, or another school-friendly idea! 🌱'
      });
    }

    // Determine age-specific criteria
    let wordCountGuide = '250-350 words';
    let styleRules = 'Simple sentences, some new words explained gently inside the story, fun adventure tone.';
    let readingLevelLabel = 'Grade 3-4 (Explorer)';

    if (age_group === '5-7') {
      wordCountGuide = '120-180 words';
      styleRules = 'Very short sentences, simple repetition, cute animals or friendly characters, warm reassuring ending, vivid sensory words.';
      readingLevelLabel = 'Grade 1-2 (Early Reader)';
    } else if (age_group === '8-10') {
      wordCountGuide = '250-350 words';
      styleRules = 'Engaging plot, clear cause and effect, gentle humor or adventure, explains tricky concepts naturally inside the story.';
      readingLevelLabel = 'Grade 3-5 (Curious Explorer)';
    } else if (age_group === '11-14') {
      wordCountGuide = '400-550 words';
      styleRules = 'Richer vocabulary, real-world context, a puzzle, dilemma or challenge to solve, clear scientific/historical mechanisms.';
      readingLevelLabel = 'Grade 6-8 (Junior Scholar)';
    } else if (age_group === '15+') {
      wordCountGuide = '500-700 words';
      styleRules = 'Mature, thoughtful, school-safe narrative, analytical depth, real-world applications and systemic connections.';
      readingLevelLabel = 'Grade 9+ (Advanced Thinker)';
    }

    if (length === 'short') {
      wordCountGuide = 'approximately 120-200 words';
    } else if (length === 'long') {
      wordCountGuide = 'approximately 450-650 words';
    }

    const systemInstruction = `You are "FableSTEM", a warm, world-class educational storyteller turning science, math, and school concepts into captivating stories children never want to stop reading.
Your mission is to teach the requested topic accurately, delighting the learner through an immersive narrative.

Safety & pedagogical rules:
- Strictly school-appropriate only. Never include violence, fear, horror, hate, weapons, or adult themes.
- Accurately teach the factual core concepts of the topic through the narrative flow.
- Format the story in 3 to 5 well-spaced, beautiful paragraphs.
- Return key vocabulary items (3 to 5 words) with child-friendly definitions and simple contextual sentences.
- End with an inspiring, memorable one-line takeaway or moral.
- Recommend 2-3 real, age-appropriate children's books or young reader books about this STEM topic.
- Recommend 2 trusted educational websites (e.g. NASA Kids, National Geographic Kids, Khan Academy, BBC Bitesize) for kids to explore further.
- Everything must be written in the specified language: ${language}.`;

    const prompt = `Write an educational story that teaches the topic "${topic}" to a learner in the age group: ${age_group}.
Target Language: ${language}
Target Length: ${wordCountGuide}
Age-tailored style rules: ${styleRules}

Return a valid JSON object matching this exact structure:
{
  "title": "Creative, inspiring title for the story",
  "story": "The complete educational story with multiple paragraphs separated by double newlines",
  "reading_level": "${readingLevelLabel}",
  "takeaway": "One-line inspiring moral or key lesson learned",
  "key_facts": ["Key learning point 1", "Key learning point 2", "Key learning point 3"],
  "vocabulary": [
    {
      "word": "Target word from the story",
      "meaning": "Clear, age-appropriate definition",
      "example": "A simple sentence showing how it is used"
    }
  ],
  "suggested_books": [
    {
      "title": "Book title",
      "author": "Author name",
      "description": "Why kids love reading this book"
    }
  ],
  "suggested_websites": [
    {
      "title": "Resource title",
      "sourceName": "NASA Kids / NatGeo Kids / Khan Academy / BBC Bitesize",
      "description": "What kids can see or play on this website",
      "searchQuery": "Search phrase to find this website"
    }
  ]
}`;

    const rawData = await generateJsonWithFallback(prompt, systemInstruction, 0.8);

    // Format and enrich suggested books with direct Amazon, Flipkart, and Google links
    const rawBooks = Array.isArray(rawData.suggested_books) && rawData.suggested_books.length > 0
      ? rawData.suggested_books
      : [
          {
            title: `The Science of ${topic} for Young Explorers`,
            author: 'National Geographic Kids',
            description: `A colorful visual guide exploring ${topic} with diagrams and fun facts.`
          },
          {
            title: `The Magic School Bus Explores ${topic}`,
            author: 'Joanna Cole',
            description: `Join Ms. Frizzle and the class on an unforgettable journey through ${topic}.`
          }
        ];

    const suggested_books = rawBooks.slice(0, 3).map((book: any) => {
      const q = encodeURIComponent(`${book.title || topic} ${book.author || ''}`.trim());
      return {
        title: book.title || `Exploring ${topic}`,
        author: book.author || 'Educational Author',
        description: book.description || `A fantastic illustrated book exploring ${topic} for young readers.`,
        amazonUrl: `https://www.amazon.com/s?k=${q}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${q}`,
        googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${book.title || topic} book`)}`
      };
    });

    // Format and enrich suggested educational websites
    const rawSites = Array.isArray(rawData.suggested_websites) && rawData.suggested_websites.length > 0
      ? rawData.suggested_websites
      : [
          {
            title: `National Geographic Kids: ${topic}`,
            sourceName: 'NatGeo Kids',
            description: `Interactive animal and science facts about ${topic}.`,
            searchQuery: `National Geographic Kids ${topic}`
          },
          {
            title: `NASA Kids' Club & STEM Learning: ${topic}`,
            sourceName: 'NASA STEM',
            description: `Fascinating real-world missions, photos, and experiments.`,
            searchQuery: `NASA Kids ${topic}`
          }
        ];

    const suggested_websites = rawSites.slice(0, 3).map((site: any) => {
      const sq = encodeURIComponent(site.searchQuery || `${site.sourceName || 'Kids Science'} ${topic}`);
      return {
        title: site.title || `Learn More About ${topic}`,
        sourceName: site.sourceName || 'Educational Resource',
        description: site.description || `Interactive games, videos, and articles about ${topic}.`,
        url: `https://www.google.com/search?q=${sq}`
      };
    });

    const data = {
      ...rawData,
      suggested_books,
      suggested_websites
    };

    res.json(data);
  } catch (error: any) {
    console.error('Error generating story:', error);
    res.status(500).json({
      error: 'Oops! Something went wrong while creating your story. Please try again!'
    });
  }
});

// Endpoint: Generate Quiz based ONLY on the story
app.post('/api/quiz', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, age_group = '8-10', language = 'English', title = '' } = req.body;

    if (!story || typeof story !== 'string') {
      return res.status(400).json({ error: 'Story content is required to generate the quiz.' });
    }

    const systemInstruction = `You are an expert educational assessment specialist for Story Teacher.
Your job is to generate exactly 5 comprehension questions based ONLY on the provided story.
CRITICAL MANDATE:
- Every single question MUST be answerable strictly from the story text.
- Do NOT test outside trivia or unmentioned facts.
- Generate exactly:
  * 3 Multiple Choice Questions (id: 1, 2, 3) each with 4 clear distinct options
  * 1 True/False Question (id: 4) with options ["True", "False"]
  * 1 Short Answer Question (id: 5) testing understanding or reasoning from the story
- Provide the correct answer and a kind, friendly explanation that points directly to what happened in the story.
- Language: ${language}. Age group: ${age_group}.`;

    const prompt = `Story Title: ${title || 'Our Story'}
Story Content:
"""
${story}
"""

Create the 5-question comprehension quiz in ${language} for age group ${age_group}.
Questions 1, 2, 3: Multiple Choice (mcq) with 4 options.
Question 4: True/False (tf) with 2 options ["True", "False"].
Question 5: Short Answer (short) - no options needed.

Return JSON in this format:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "...",
      "explanation": "..."
    },
    {
      "id": 4,
      "type": "tf",
      "question": "...",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "..."
    },
    {
      "id": 5,
      "type": "short",
      "question": "...",
      "answer": "...",
      "explanation": "..."
    }
  ]
}`;

    const data = await generateJsonWithFallback(prompt, systemInstruction, 0.3);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      error: 'Unable to create the quiz right now. Please try again!'
    });
  }
});

// Endpoint: Evaluate Quiz Answers
app.post('/api/evaluate', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, questions, user_answers, age_group = '8-10', language = 'English' } = req.body;

    if (!story || !questions || !user_answers) {
      return res.status(400).json({ error: 'Missing required parameters for evaluation.' });
    }

    const systemInstruction = `You are Story Teacher, a kind, encouraging tutor grading a student's reading comprehension quiz.
Evaluate the student's answers using the story and the questions.
Evaluation Rules:
- MCQ & True/False: If user answered the exact correct option, it is correct (1 point), else incorrect (0 points).
- Short Answer: Grade fairly based on understanding. Accept alternative wording or spelling if the conceptual meaning matches what was taught in the story! Give 1 for correct, 0.5 for partial understanding, or 0 if completely missed.
- Feedback: For EVERY question, write a 1-2 sentence warm, encouraging comment in ${language}.
  * ALWAYS praise positive effort first!
  * If incorrect, explain gently what part of the story they can reread without ever sounding harsh or discouraging.
- Summary: A warm, motivational 2-line summary celebrating the learner's effort, highlighting their curiosity.`;

    const prompt = `Story:
"""
${story}
"""

Questions with Key:
${JSON.stringify(questions, null, 2)}

Learner's Submitted Answers:
${JSON.stringify(user_answers, null, 2)}

Target Age: ${age_group}
Language: ${language}

Return JSON in this format:
{
  "score": 4,
  "total": 5,
  "summary": "Warm encouraging 2-line note...",
  "feedback": [
    {
      "id": 1,
      "correct": true,
      "partial": false,
      "comment": "Praise and hint...",
      "correct_answer": "..."
    }
  ]
}`;

    const data = await generateJsonWithFallback(prompt, systemInstruction, 0.2);
    res.json(data);
  } catch (error: any) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({
      error: 'Unable to evaluate answers right now. Please try submitting again!'
    });
  }
});

// Endpoint: Compare Storytelling by Age (Pedagogical Matrix)
app.post('/api/compare-ages', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { topic, language = 'English' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a topic to compare.' });
    }

    if (isUnsafeTopic(topic)) {
      return res.status(400).json({
        error: 'unsafe',
        message: 'Let’s choose a safer learning topic! Try science, nature, history, friendship or another school-friendly idea! 🌱'
      });
    }

    const systemInstruction = `You are Story Teacher's Curriculum Director.
Demonstrate how the EXACT same topic "${topic}" should be taught across 4 distinct age groups.
Rules:
- Language: ${language}
- For each age group (5-7, 8-10, 11-14, 15+), provide a realistic story opening excerpt, reading level label, pedagogical strategy, sample vocabulary, and an illustrative quote.
Return valid JSON.`;

    const prompt = `Topic: "${topic}" in ${language}.
Provide a side-by-side comparison matrix of how this topic is explained to:
1. Ages 5-7 (Early Reader)
2. Ages 8-10 (Curious Explorer)
3. Ages 11-14 (Junior Scholar)
4. Ages 15+ (Advanced Thinker)

Return JSON in this format:
{
  "topic": "${topic}",
  "overview": "Brief 1-sentence pedagogical summary of how the explanation evolves",
  "comparisons": [
    {
      "age_group": "5-7",
      "stage_name": "Early Reader",
      "word_count_range": "120–180 words",
      "focus": "Sensory exploration, cute animal friends, simple repetition",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 5-7...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 5-7 year olds"
    },
    {
      "age_group": "8-10",
      "stage_name": "Curious Explorer",
      "word_count_range": "250–350 words",
      "focus": "Adventure narrative, causes and effects explained inside the plot",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 8-10...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 8-10 year olds"
    },
    {
      "age_group": "11-14",
      "stage_name": "Junior Scholar",
      "word_count_range": "400–550 words",
      "focus": "Scientific mechanisms, dilemmas, real-world puzzles",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 11-14...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 11-14 year olds"
    },
    {
      "age_group": "15+",
      "stage_name": "Advanced Thinker",
      "word_count_range": "500–700 words",
      "focus": "Systemic analysis, philosophical and historical context",
      "sample_excerpt": "A short 2-3 sentence story excerpt tailored for 15+...",
      "key_vocabulary": ["Word1", "Word2"],
      "why_it_works": "Why this specific tone works for 15+ learners"
    }
  ]
}`;

    const data = await generateJsonWithFallback(prompt, systemInstruction, 0.4);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating age comparison:', error);
    res.status(500).json({ error: 'Could not generate age comparison matrix.' });
  }
});

// Endpoint: Generate Teacher Classroom Worksheet & Activity
app.post('/api/worksheet', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { story, title, topic, age_group, language = 'English' } = req.body;

    if (!story) {
      return res.status(400).json({ error: 'Story content required for worksheet.' });
    }

    const systemInstruction = `You are a master teacher designing a print-ready classroom activity sheet and lesson guide based on the story.
Language: ${language}. Age: ${age_group}.`;

    const prompt = `Story Title: ${title}
Topic: ${topic}
Story:
"""
${story}
"""

Create a teacher-ready lesson plan and student activity guide in ${language}.
Return JSON:
{
  "lesson_objective": "1-sentence learning objective",
  "discussion_questions": ["Question 1 to ask students", "Question 2 to ask students", "Question 3 to ask students"],
  "hands_on_activity": {
    "title": "Creative 10-minute classroom or at-home activity",
    "instructions": "Simple step-by-step instructions requiring only basic paper/pencil/household items"
  },
  "critical_thinking_prompt": "An open-ended prompt for students to write or draw",
  "teacher_tips": "A helpful pedagogical tip for explaining this topic"
}`;

    const data = await generateJsonWithFallback(prompt, systemInstruction, 0.3);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating worksheet:', error);
    res.status(500).json({ error: 'Could not generate classroom worksheet.' });
  }
});

// Vite middleware in development vs Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Story Teacher Server is running on port ${PORT}`);
  });
}

startServer();
