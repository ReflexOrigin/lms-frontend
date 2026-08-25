'use client';

type LessonViewerProps = {
  content?: string;
  videoUrl?: string;
};

export default function LessonViewer({ content, videoUrl }: LessonViewerProps) {
  // Helper to extract YouTube ID if it's a YouTube URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch (e) {
      // Invalid URL
    }
    return url;
  };

  const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : null;

  return (
    <div className="space-y-8">
      {embedUrl && (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe 
            src={embedUrl} 
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title="Lesson Video"
          />
        </div>
      )}

      {content && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div 
            className="prose max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}

      {!embedUrl && !content && (
        <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-500 font-medium">This lesson does not contain any content.</p>
        </div>
      )}
    </div>
  );
}
