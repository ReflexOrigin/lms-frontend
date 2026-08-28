import { fetchWithAuth } from "@/lib/api";
import { getAllRoles } from "@/lib/actions/admin";
import UsersClient from "./UsersClient";

export default async function AdminUsers() {
  let users: any[] = [];
  let roles: any[] = [];
  try {
    const res = await fetchWithAuth('/api/users?populate=role');
    if (res.ok) {
      users = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch admin users", error);
  }

  try {
    roles = await getAllRoles() || [];
  } catch (error) {
    console.error("Failed to fetch roles", error);
  }

  return <UsersClient initialUsers={users} roles={roles} />;
}
