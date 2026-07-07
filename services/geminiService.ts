import { SearchResponse, UserLocation } from '../types';

export const searchOrganicProducts = async (query: string, location: UserLocation | null, apiKey?: string): Promise<SearchResponse> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["x-gemini-key"] = apiKey;

  const response = await fetch("/api/search", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, location }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Search failed");
  }
  
  return response.json();
};

export const geocodeLocation = async (locationName: string, apiKey?: string): Promise<{ lat: number, lng: number, name: string }> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["x-gemini-key"] = apiKey;

  const response = await fetch("/api/geocode", {
    method: "POST",
    headers,
    body: JSON.stringify({ locationName }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Geocoding failed");
  }
  
  return response.json();
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const getBobAssistantResponse = async (messages: ChatMessage[], apiKey?: string): Promise<{ text: string }> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["x-gemini-key"] = apiKey;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Chat failed");
  }

  return response.json();
};
