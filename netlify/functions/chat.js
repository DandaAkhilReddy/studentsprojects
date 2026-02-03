// Netlify Serverless Function for Claude AI Chatbot
// This keeps the API key secure on the server side

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-haiku-20240307';
const MAX_OUTPUT_TOKENS = 400;
const RATE_LIMIT = 10; // Max messages per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// In-memory rate limit store (resets on cold start, which is fine for basic protection)
const rateLimitStore = new Map();

// Clean up old entries periodically
const cleanupRateLimit = () => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    // Remove entries older than the rate window
    data.timestamps = data.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
    if (data.timestamps.length === 0) {
      rateLimitStore.delete(ip);
    }
  }
};

// Check rate limit for an IP
const checkRateLimit = (ip) => {
  cleanupRateLimit();
  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { timestamps: [now] });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  const data = rateLimitStore.get(ip);
  // Filter to only timestamps within the window
  data.timestamps = data.timestamps.filter((t) => now - t < RATE_WINDOW_MS);

  if (data.timestamps.length >= RATE_LIMIT) {
    const oldestTimestamp = data.timestamps[0];
    const resetInMs = RATE_WINDOW_MS - (now - oldestTimestamp);
    const resetInMin = Math.ceil(resetInMs / 60000);
    return { allowed: false, remaining: 0, resetInMin };
  }

  data.timestamps.push(now);
  return { allowed: true, remaining: RATE_LIMIT - data.timestamps.length };
};

// Cost-optimized system prompt (~150 tokens)
const SYSTEM_PROMPT = `You are the AgentChains.ai assistant. Be concise (2-3 sentences max).

Services:
- Code Only: $199 (3000+ lines of code)
- Docs Only: $299 (8 documents + PPT)
- Complete Package: $399 (code + docs + PPT)
- Individual Assignments: $49 each

Process: Submit request → Get quote → Pay 50% → Receive project → Pay remaining

Referral: Earn $50 per referral. Friend also gets $50.

Free tools available at /tools including Resume Builder.

For orders, direct users to click "Get Started" button on the website.

Be helpful, friendly, and direct. Answer questions about services, pricing, and process.`;

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Rate limiting by IP
    const clientIP =
      event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      event.headers['client-ip'] ||
      'unknown';

    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      return {
        statusCode: 429,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: `You've reached the message limit (${RATE_LIMIT}/hour). Please try again in ${rateCheck.resetInMin} minutes.`,
          rateLimited: true,
          resetInMin: rateCheck.resetInMin,
        }),
      };
    }

    // Parse request body
    const { message } = JSON.parse(event.body);

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Truncate message if too long (cost control)
    const truncatedMessage = message.slice(0, 1000);

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Chatbot not configured' }),
      };
    }

    // Call Anthropic API
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: truncatedMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Failed to get response from AI' }),
      };
    }

    const data = await response.json();

    // Extract the text response
    const aiResponse =
      data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        response: aiResponse,
        remaining: rateCheck.remaining,
        usage: {
          input_tokens: data.usage?.input_tokens,
          output_tokens: data.usage?.output_tokens,
        },
      }),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
