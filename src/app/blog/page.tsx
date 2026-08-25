import { getBlogPosts } from '@/lib/actions/blog';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | LMS Platform',
  description: 'Latest news, updates, and articles from our platform.',
};

export default async function BlogListPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Our Blog</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, updates, and knowledge sharing from our instructors and content managers.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4" aria-hidden="true">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Posts Yet</h2>
          <p className="text-gray-500">Check back later for new articles and updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              key={post.documentId} 
              href={`/blog/${post.documentId}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              <div className="aspect-video w-full bg-blue-50 overflow-hidden relative border-b border-gray-100">
                {post.coverImage ? (
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-200 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                {/* Basic text extraction from RichText block for a snippet */}
                <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-sm">
                  {typeof post.body === 'string' ? post.body.replace(/<[^>]+>/g, '') : 'Read the full article to learn more.'}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {post.author?.username?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {post.author?.username || 'Admin'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
