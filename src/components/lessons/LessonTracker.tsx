'use client';

import { useState, useRef } from 'react';
import LessonViewer from './LessonViewer';
import MarkCompleteButton from './MarkCompleteButton';
import { updateLessonProgress } from '@/lib/actions/progress';

type LessonTrackerProps = {
  courseId: string;
  lessonId: string;
  content?: string;
  videoUrl?: string;
  isCompleted: boolean;
};

export default function LessonTracker({ courseId, lessonId, content, videoUrl, isCompleted: initialCompleted }: LessonTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [videoPercentage, setVideoPercentage] = useState(initialCompleted ? 100 : 0);
  
  // Track if we have already unlocked the button for this session
  const [isUnlocked, setIsUnlocked] = useState(initialCompleted);
  
  const lastPingPercentage = useRef(0);

  const handleVideoProgress = (percentage: number) => {
    if (isCompleted) return;
    
    setVideoPercentage(percentage);

    // If they hit 90%, unlock the button!
    if (percentage >= 90 && !isUnlocked) {
      setIsUnlocked(true);
    }

    // Ping backend every 10% increment
    const currentDecile = Math.floor(percentage / 10) * 10;
    if (currentDecile > lastPingPercentage.current && currentDecile > 0) {
      lastPingPercentage.current = currentDecile;
      // We purposefully don't await this so it happens silently in the background
      updateLessonProgress(courseId, lessonId, false, percentage).catch(() => {});
    }
  };

  const hasVideo = !!videoUrl;
  const isButtonDisabled = hasVideo && !isUnlocked;

  return (
    <>
      <LessonViewer 
        content={content} 
        videoUrl={videoUrl} 
        onProgress={handleVideoProgress} 
      />

      <div className="mt-8 flex justify-center sm:justify-start flex-col gap-2">
        <MarkCompleteButton 
          courseId={courseId} 
          lessonId={lessonId} 
          isCompleted={isCompleted}
          disabled={isButtonDisabled}
        />
        {isButtonDisabled && (
          <p className="text-sm text-gray-500 font-medium sm:text-left text-center">
            Watch the video to at least 90% to unlock. ({Math.floor(videoPercentage)}%)
          </p>
        )}
      </div>
    </>
  );
}
