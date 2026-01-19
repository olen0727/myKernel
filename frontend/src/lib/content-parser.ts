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

    // Mock URL Parsing
    if (isUrl) {
        return mockUrlParse(trimmed);
    }

    // Mixed Content Parsing
    const lines = trimmed.split('\n');
    const title = lines[0] || "Untitled";
    const content = lines.slice(1).join('\n').trim();

    // Check if the first line looks like a URL
    if (/^(http|https):\/\/[^ "]+$/.test(title)) {
        const urlData = await mockUrlParse(title);
        return {
            ...urlData,
            content: content || urlData.description // Use description as content if empty
        };
    }

    return {
        title,
        description: content.substring(0, 100),
        content,
    };
}

async function mockUrlParse(url: string): Promise<ParsedContent> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const domain = new URL(url).hostname;

    if (domain.includes("github.com")) {
        return {
            title: "GitHub - Repo Name",
            description: "A repository description from GitHub.",
            url,
            image: "https://github.com/fluidicon.png"
        };
    }

    if (domain.includes("youtube.com")) {
        return {
            title: "YouTube Video Title",
            description: "Video description...",
            url,
            image: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg"
        };
    }

    return {
        title: `Page Title from ${domain}`,
        description: "Meta description extracted from the page.",
        url,
    };
}
