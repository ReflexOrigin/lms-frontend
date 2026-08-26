import { fetchWithAuth } from "@/lib/api";
import UsersClient from "./UsersClient";

export default async function AdminUsers() {
  let users: any[] = [];
  try {
    const res = await fetchWithAuth('/api/users?populate=role');
    if (res.ok) {
      users = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch admin users", error);
  }

  return <UsersClient initialUsers={users} />;
}

