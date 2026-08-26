'use client';

import dynamic from 'next/dynamic';
// @ts-ignore
const ReactPlayer: any = dynamic(() => import('react-player'), { ssr: false });

type LessonViewerProps = {
  content?: string;
  videoUrl?: string;
  onProgress?: (percentage: number) => void;
};

export default function LessonViewer({ content, videoUrl, onProgress }: LessonViewerProps) {
  return (
    <div className="space-y-8">
      {videoUrl && (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <ReactPlayer 
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
            onProgress={(state: any) => {
              if (onProgress && state.played) {
                // state.played is a decimal between 0 and 1
                onProgress(state.played * 100);
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
