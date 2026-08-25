import { getBlogPost, getBlogPosts } from '@/lib/actions/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata(props: { params: Promise<{ documentId: string }> }) {
  const params = await props.params;
  try {
    const post = await getBlogPost(params.documentId);
    return {
      title: `${post.title} | LMS Blog`,
    };
  } catch {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPostPage(props: { params: Promise<{ documentId: string }> }) {
  const params = await props.params;
  
  let post;
  try {
    post = await getBlogPost(params.documentId);
  } catch (err) {
    notFound();
  }

  // Very basic markdown/richtext rendering (in a real app, use a proper markdown parser or BlocksRenderer for Strapi v5)
  // Strapi v5 often uses a Blocks Rich Text format natively. We'll render it safely or fallback to string.
  
  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      // Basic markdown/HTML string
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    // If it's Strapi v5 blocks format (array of nodes)
    if (Array.isArray(content)) {
      return content.map((block: any, idx: number) => {
        if (block.type === 'paragraph') {
          return <p key={idx} className="mb-6 leading-relaxed text-lg">{block.children?.map((c: any) => c.text).join('')}</p>;
        }
        if (block.type === 'heading') {
          const text = block.children?.map((c: any) => c.text).join('');
          if (block.level === 1) return <h1 key={idx} className="text-4xl font-bold mt-12 mb-6">{text}</h1>;
          if (block.level === 2) return <h2 key={idx} className="text-3xl font-bold mt-10 mb-4">{text}</h2>;
          return <h3 key={idx} className="text-2xl font-bold mt-8 mb-4">{text}</h3>;
        }
        if (block.type === 'list') {
          return (
            <ul key={idx} className="list-disc pl-6 mb-6 space-y-2 text-lg">
              {block.children?.map((li: any, liIdx: number) => (
                <li key={liIdx}>{li.children?.map((c: any) => c.text).join('')}</li>
              ))}
            </ul>
          );
        }
        return null;
      });
    }

    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-blue-600 hover:underline font-medium mb-8 inline-block">
            ← Back to Blog
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
              {post.author?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.author?.username || 'Admin'}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="aspect-[21/9] w-full rounded-2xl shadow-xl overflow-hidden border-4 border-white">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32 text-gray-800">
        <div className="prose prose-lg prose-blue max-w-none">
          {renderContent(post.body)}
        </div>
      </article>
    </div>
  );
}
