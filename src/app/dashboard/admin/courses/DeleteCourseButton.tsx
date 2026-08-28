"use client";

import { Trash2 } from "lucide-react";
import { deleteCourse } from "@/lib/actions/course";
import { useRouter } from "next/navigation";

export default function DeleteCourseButton({ documentId }: { documentId: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={async () => {
        if (confirm("Are you sure you want to delete this course?")) {
          await deleteCourse(documentId);
          router.refresh();
        }
      }}
      className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center"
    >
      <Trash2 size={16} />
    </button>
  );
}
