'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
const ReactPlayer: any = dynamic(() => import('react-player'), { ssr: false });

type LessonViewerProps = {
  content?: string;
  videoUrl?: string;
  onProgress?: (percentage: number) => void;
};

export default function LessonViewer({ content, videoUrl, onProgress }: LessonViewerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  // react-player works best with standard watch URLs rather than embed URLs
  const normalizedUrl = videoUrl ? videoUrl.replace('youtube.com/embed/', 'youtube.com/watch?v=') : undefined;

  return (
    <div className="space-y-8">
      {mounted && normalizedUrl && (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <ReactPlayer 
            src={normalizedUrl}
            width="100%"
            height="100%"
            controls={true}
            onTimeUpdate={(e: any) => {
              if (onProgress) {
                const currentTime = e.target.currentTime;
                const duration = e.target.duration;
                if (duration && duration > 0) {
                  onProgress((currentTime / duration) * 100);
                }
              }
            }}
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

      {!videoUrl && !content && (
        <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-500 font-medium">This lesson does not contain any content.</p>
        </div>
      )}
    </div>
  );
}
