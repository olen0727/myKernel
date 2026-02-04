import { parserClient } from "./parser-client";

export interface ParsedContent {
    title: string;
    description: string;
    url?: string;
    image?: string;
    content?: string;
}

export async function parseContent(input: string): Promise<ParsedContent> {
    const trimmed = input.trim();
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(trimmed);

    // URL Parsing
    if (isUrl) {
        const result = await parserClient.parseUrl(trimmed);
        if (result) return result;
        // Fallback if client returns null (though client handles try/catch)
        return {
            title: trimmed,
            description: "",
            url: trimmed
        };
    }

    // Mixed Content Parsing
    const lines = trimmed.split('\n');
    const title = lines[0] || "Untitled";
    const content = lines.slice(1).join('\n').trim();

    // Check if the first line looks like a URL
    if (/^(http|https):\/\/[^ "]+$/.test(title)) {
        const urlData = await parserClient.parseUrl(title);
        if (urlData) {
            return {
                ...urlData,
                content: content || urlData.content || urlData.description // Prioritize explicit content, then parsed content/desc
            };
        }
    }

    return {
        title,
        description: content.substring(0, 100),
        content,
    };
}

