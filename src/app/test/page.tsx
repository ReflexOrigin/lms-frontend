import { fetchStrapi } from '@/lib/strapi';

export default async function TestPage() {
  let posts: any[] = [];
  let error = null;
  try {
    const data = await fetchStrapi('/test-posts?populate=*', { cache: 'no-store' });
    posts = data.data;
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>LMS Strapi Connection Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {posts && posts.length === 0 && <p>No posts found.</p>}
      {posts && posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
