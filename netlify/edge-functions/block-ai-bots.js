// Returns 403 to known AI training/scraping crawlers.
// Keep in sync with layouts/robots.txt and https://github.com/ai-robots-txt/ai.txt
const AI_BOT_PATTERN = new RegExp(
  [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'meta-externalagent',
    'meta-externalfetcher',
    'FacebookBot',
    'Bytespider',
    'PerplexityBot',
    'Perplexity-User',
    'Amazonbot',
    'cohere-ai',
    'cohere-training-data-crawler',
    'Diffbot',
    'Omgilibot',
    'Omgili',
    'ImagesiftBot',
    'Timpibot',
    'YouBot',
    'AI2Bot',
    'Ai2Bot-Dolma',
    'PetalBot',
    'Scrapy',
    'img2dataset',
    'DuckAssistBot',
    'MistralAI-User',
    'Kangaroo Bot',
    'PanguBot',
  ].join('|'),
  'i'
)

export default (request) => {
  const userAgent = request.headers.get('user-agent') || ''
  if (AI_BOT_PATTERN.test(userAgent)) {
    return new Response('AI crawling is not permitted. See https://patyoon.com/terms/', {
      status: 403,
      headers: { 'content-type': 'text/plain' },
    })
  }
}

export const config = {
  path: '/*',
  // Let crawlers read the opt-out signals themselves
  excludedPath: ['/robots.txt', '/.well-known/*', '/terms/'],
}
