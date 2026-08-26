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
    // Populate instructor to get their name
    const query = filters ? `?populate=instructor&${filters}` : '?populate=instructor';
    const res = await fetchWithAuth(`/api/courses${query}`);
    
    if (!res.ok) {
      console.error(`Course fetch failed with status ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    
    // Map Strapi's flat response back to our expected shape if needed
    // Assuming Strapi v5 returns data array without nesting attributes
    return data.data || [];
  } catch (error) {
    console.error('Course fetch error:', error);
    return []; // Return empty array if backend is down or empty
  }
}

export async function getCourseBySlug(slug: string): Promise<StrapiCourse | null> {
  try {
    const res = await fetchWithAuth(`/api/courses?filters[slug][$eq]=${slug}&populate=*`);
    if (!res.ok) throw new Error('Failed to fetch course');
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Course fetch by slug error:', error);
    return null;
  }
}
