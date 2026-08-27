import { fetchWithAuth } from '../api';

export interface StrapiCourse {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'published' | 'draft' | 'archived';
  duration: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  instructor?: any;
  lessons?: any[];
  quizzes?: any[];
  // Extracted fields to map to our dummy data structure
  students?: number;
  completion?: number;
  quizAvg?: number;
  rating?: number;
  thumbId?: string;
}

export async function getCourses(filters = ''): Promise<StrapiCourse[]> {
  try {
    // Populate instructor to get their name, and lessons to get lesson count
    const query = filters ? `?populate[0]=instructor&populate[1]=lessons&${filters}` : '?populate[0]=instructor&populate[1]=lessons';
    
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    console.log(`[getCourses] JWT Cookie present: ${!!cookieStore.get('jwt')?.value}`);

    const res = await fetchWithAuth(`/api/courses${query}`, { cache: 'no-store' });
    
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Course fetch failed with status ${res.status}. Body: ${errText}`);
      return [];
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Course fetch error:', error);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<StrapiCourse | null> {
  try {
    const res = await fetchWithAuth(`/api/courses?filters[slug][$eq]=${slug}&populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch course');
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Course fetch by slug error:', error);
    return null;
  }
}
