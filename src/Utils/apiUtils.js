const API_URL = import.meta.env.VITE_API_URL;
import { saveToken, saveUser } from "../Utils/auth";

export async function login(username, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (import.meta.env.VITE_MODE === "development") {
        throw new Error(errorData.message || "Login failed");
      }
    }

    const data = await res.json();
    saveToken(data.token);
    saveUser(data.user); // <-- include role + allowedReaders

    return { token: data.token, user: data.user };
  } catch (err) {
    if (import.meta.env.VITE_MODE === "development") {
      console.error("Login API error:", err);
      throw err;
    }
  }
}

export const fetchExportData = async ({
  type,
  readerName,
  startTime,
  endTime,
}) => {
  try {
    const formattedStart = startTime.replace("T", " ");
    const formattedEnd = endTime.replace("T", " ");
    const params = new URLSearchParams({
      readerName,
      formattedStart,
      formattedEnd,
    });

    const response = await fetch(`${API_URL}/export/${type}?${params}`);

    if (response.status === 204) {
      throw new Error("No data to export.");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Automatically download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (import.meta.env.VITE_MODE === "development") {
      console.error("Fetch failed:", error);
    }

    throw error;
  }
};
