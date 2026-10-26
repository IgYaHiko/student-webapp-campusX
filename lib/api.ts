import { toast } from "sonner";
import { json } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper to get the token from local storage
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Helper to save the token
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

// Helper to remove the token
export function removeToken() {
  localStorage.removeItem("token");
}

// ---------- AUTH ENDPOINTS ----------

export async function loginApi(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  return json; // { success, token, user }
}

export async function registerApi(data: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, role: "student" }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  return json; // { success, token, user }
}

// ---------- COMPLAINT ENDPOINTS ----------

export async function getMyComplaintsApi() {
  const token = getToken();
  // Use the new dedicated route!
  const res = await fetch(`${API_URL}/complaints/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch complaints");
  return json;
}
export async function getCategoriesApi() {
  const res = await fetch(`${API_URL}/categories`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch categories");
  return json; // { success: true, data: [{ id, slug, name, ... }] }
}

export async function createComplaintApi(data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create complaint");

  return json;

}


// ---- profile apis  ---
export async function getMyProfileApi() {
   try {
    const token = getToken();
    const res = await fetch(`${API_URL}/student/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch profile");
  return json; 
   }catch(error) {
    toast.error("No student data!");
   }
   
} 

export async function updateMyProfileApi(data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/student/update-me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const jsonData = await res.json();
  if(!res.ok) throw new Error("Failed to update profile");

  return json;
}