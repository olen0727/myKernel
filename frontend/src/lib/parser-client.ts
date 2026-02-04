/// <reference types="vite/client" />
import { ParsedContent } from "./content-parser";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8888";

interface ParseResponse {
    title: string;
    description?: string;
    image?: string;
    content: string;
    url: string;
}

export const parserClient = {
    async parseUrl(url: string): Promise<ParsedContent | null> {
        try {
            const response = await fetch(`${API_URL}/api/v1/parse-url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                console.error("Parse URL failed:", response.statusText);
                return null;
            }

            const data: ParseResponse = await response.json();

            return {
                title: data.title,
                description: data.description || "",
                content: data.content,
                url: data.url,
                image: data.image
            };
        } catch (error) {
            console.error("Parse URL error:", error);
            // Fallback to basic info if API fails
            return {
                title: url,
                description: "",
                url: url,
                content: ""
            };
        }
    }
};
