import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './prompt';

const MAX_TURNS = 16;
const MAX_MESSAGE_CHARS = 600;
const MAX_BODY_BYTES = 20_000;

type ChatTurn = { role: 'user' | 'assistant'; content: string };

const json = (body: unknown, status: number, headers: HeadersInit): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }
  });

// Accepts only a short, well-formed conversation that ends with a visitor message.
const parseTurns = (payload: unknown): ChatTurn[] | null => {
  const raw = (payload as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS) return null;
  const turns: ChatTurn[] = [];
  for (const item of raw) {
    const turnRole = (item as ChatTurn | null)?.role;
    const content = (item as ChatTurn | null)?.content;
    if (turnRole !== 'user' && turnRole !== 'assistant') return null;
    if (typeof content !== 'string') return null;
    const trimmed = content.trim();
    if (!trimmed) return null;
    // Visitor messages are length-limited; earlier assistant replies are echoed back and may be longer.
    if (turnRole === 'user' && trimmed.length > MAX_MESSAGE_CHARS) return null;
    if (trimmed.length > 4000) return null;
    turns.push({ role: turnRole, content: trimmed });
  }
  if (turns[0].role !== 'user' || turns[turns.length - 1].role !== 'user') return null;
  return turns;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map(value => value.trim());
    const originAllowed = allowed.includes(origin);
    const cors: Record<string, string> = originAllowed
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin'
        }
      : { Vary: 'Origin' };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: originAllowed ? 204 : 403, headers: cors });
    }
    if (new URL(request.url).pathname !== '/chat' || request.method !== 'POST') {
      return json({ error: 'not_found' }, 404, cors);
    }
    if (!originAllowed) {
      return json({ error: 'forbidden' }, 403, cors);
    }

    const visitor = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.CHAT_LIMITER.limit({ key: visitor });
    if (!success) {
      return json({ error: 'rate_limited' }, 429, cors);
    }

    const bodyText = await request.text();
    if (bodyText.length > MAX_BODY_BYTES) {
      return json({ error: 'too_large' }, 413, cors);
    }
    let payload: unknown;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return json({ error: 'bad_request' }, 400, cors);
    }
    const turns = parseTurns(payload);
    if (!turns) {
      return json({ error: 'bad_request' }, 400, cors);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'not_configured' }, 503, cors);
    }
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 25_000 });

    try {
      const response = await client.beta.messages.create({
        model: env.MODEL,
        max_tokens: 4000,
        // Short factual answers: low effort keeps replies quick and cheap.
        output_config: { effort: 'low' },
        // If a safety classifier declines a message, the API retries on a fallback model.
        // Haiku has no server-side fallback, so it is only requested for other models.
        ...(env.MODEL.startsWith('claude-haiku')
          ? {}
          : { betas: ['server-side-fallback-2026-07-01' as const], fallbacks: 'default' as const }),
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: turns
      });

      if (response.stop_reason === 'refusal') {
        return json({ reply: "I can't help with that one. I'm here to answer questions about Oscar's work, skills and education." }, 200, cors);
      }
      const reply = response.content
        .flatMap(block => (block.type === 'text' ? [block.text] : []))
        .join('')
        .trim();
      if (!reply) {
        return json({ error: 'empty_reply' }, 502, cors);
      }
      return json({ reply }, 200, cors);
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        return json({ error: 'rate_limited' }, 429, cors);
      }
      if (error instanceof Anthropic.AuthenticationError) {
        console.error('Anthropic API key was rejected');
        return json({ error: 'not_configured' }, 503, cors);
      }
      if (error instanceof Anthropic.APIError) {
        console.error(`Anthropic API error ${error.status}: ${error.message}`);
        return json({ error: 'upstream_error' }, 502, cors);
      }
      console.error('Unexpected error', error);
      return json({ error: 'upstream_error' }, 502, cors);
    }
  }
} satisfies ExportedHandler<Env>;
