const youtubeHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
]);

export function getYouTubeEmbedUrl(input?: string): string | null {
  if (!input) return null;

  try {
    const url = new URL(input.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return null;

    const host = url.hostname.toLowerCase();
    if (!youtubeHosts.has(host)) return null;

    const pathSegments = url.pathname.split('/').filter(Boolean);
    const videoId = host === 'youtu.be'
      ? pathSegments[0]
      : url.searchParams.get('v') ?? pathSegments[1];

      if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  } catch {
    return null;
  }
}