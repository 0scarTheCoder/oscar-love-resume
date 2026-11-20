export {};

const msg = (id: string, sender: 'user' | 'bot', text: string) => ({ id, sender, text, timestamp: new Date() });

describe('AI chat endpoint wiring', () => {
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
    delete process.env.REACT_APP_CHAT_API_URL;
    jest.resetModules();
  });

  const load = (url?: string) => {
    if (url) process.env.REACT_APP_CHAT_API_URL = url;
    jest.resetModules();
    return require('./EmbeddedChat');
  };

  test('history drops the welcome message and starts with a visitor message', () => {
    const { toTurns } = load();
    const turns = toTurns([msg('welcome', 'bot', 'Hi'), msg('1', 'user', 'q1'), msg('2', 'bot', 'a1'), msg('3', 'user', 'q2')]);
    expect(turns).toEqual([
      { role: 'user', content: 'q1' },
      { role: 'assistant', content: 'a1' },
      { role: 'user', content: 'q2' }
    ]);
  });

  test('long history is trimmed and still starts with a visitor message', () => {
    const { toTurns } = load();
    const history = Array.from({ length: 30 }, (_, i) => msg(String(i), i % 2 === 0 ? 'user' : 'bot', `m${i}`));
    history.push(msg('30', 'user', 'last'));
    const turns = toTurns(history);
    expect(turns.length).toBeLessThanOrEqual(12);
    expect(turns[0].role).toBe('user');
    expect(turns[turns.length - 1]).toEqual({ role: 'user', content: 'last' });
  });

  test('without a configured endpoint nothing is fetched', async () => {
    const { askAssistant } = load();
    global.fetch = jest.fn();
    expect(await askAssistant([{ role: 'user', content: 'hi' }])).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('returns the model reply and posts only the conversation', async () => {
    const { askAssistant } = load('https://chat.example/');
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply: ' March 2026. ' }) });
    expect(await askAssistant([{ role: 'user', content: 'when did he start' }])).toBe('March 2026.');
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://chat.example/chat');
    expect(JSON.parse(init.body)).toEqual({ messages: [{ role: 'user', content: 'when did he start' }] });
  });

  test('falls back (null) on server errors, bad payloads and network failures', async () => {
    const { askAssistant } = load('https://chat.example');
    const turns = [{ role: 'user', content: 'hi' }];
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) });
    expect(await askAssistant(turns)).toBeNull();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply: 42 }) });
    expect(await askAssistant(turns)).toBeNull();
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    expect(await askAssistant(turns)).toBeNull();
  });

  test('rate limiting gives a clear message', async () => {
    const { askAssistant } = load('https://chat.example');
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) });
    expect(await askAssistant([{ role: 'user', content: 'hi' }])).toMatch(/try again in a minute/);
  });
});
