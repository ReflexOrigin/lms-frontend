import { fetchWithAuth } from '../api';

export interface StrapiUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  // Custom fields
  status?: string;
  avatarTone?: string;
}

export async function getUsers(filters = ''): Promise<StrapiUser[]> {
  try {
    // Requires Admin or specific Manager permissions to hit /api/users
    const query = filters ? `?populate=role&${filters}` : '?populate=role';
    const res = await fetchWithAuth(`/api/users${query}`);
    
    if (!res.ok) {
      console.warn(`Users fetch failed (likely due to permissions): ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('User fetch error:', error);
    return [];
  }
}

export async function getCurrentUser(): Promise<StrapiUser | null> {
  try {
    const res = await fetchWithAuth('/api/users/me?populate=role');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Current user fetch error:', error);
    return null;
  }
}
