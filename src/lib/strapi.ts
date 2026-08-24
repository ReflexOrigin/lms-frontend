const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapi(path: string, options?: RequestInit) {
  const url = `${STRAPI_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
  return res.json();
}
