import { describe, it, expect } from "vitest"
import { parseContent } from "../content-parser"

describe("content-parser", () => {
    // Basic parsing tests
    it("parses simple text correctly", async () => {
        const text = "My Note Title\nHere is the content of the note."
        const result = await parseContent(text)

        expect(result.title).toBe("My Note Title")
        expect(result.content).toBe("Here is the content of the note.")
        expect(result.url).toBeUndefined()
    })

    it("parses pure URL correctly", async () => {
        const url = "https://example.com"
        const result = await parseContent(url)

        expect(result.url).toBe(url)
        expect(result.title).toContain("Page Title")
    })

    it("parses mixed URL and content correctly", async () => {
        const text = "https://example.com\nThis is my comment on the link."
        const result = await parseContent(text)

        expect(result.url).toBe("https://example.com")
        expect(result.content).toBe("This is my comment on the link.")
    })

    // M5: Edge cases tests
    it("handles empty input", async () => {
        const result = await parseContent("")
        expect(result.title).toBe("")
        expect(result.content).toBe("")
    })

    it("handles whitespace-only input", async () => {
        const result = await parseContent("   \n  \n  ")
        expect(result.title).toBe("")
    })

    it("handles single line input without newline", async () => {
        const result = await parseContent("Just a title")
        expect(result.title).toBe("Just a title")
        expect(result.content).toBe("")
    })

    it("handles special characters in content", async () => {
        const text = "Title with émojis 🎉\nContent with <script>alert('xss')</script>"
        const result = await parseContent(text)

        expect(result.title).toBe("Title with émojis 🎉")
        expect(result.content).toContain("<script>")
    })

    it("handles URL with query parameters", async () => {
        const url = "https://example.com/page?foo=bar&baz=123"
        const result = await parseContent(url)

        expect(result.url).toBe(url)
    })

    it("handles URL with fragments", async () => {
        const url = "https://example.com/page#section"
        const result = await parseContent(url)

        expect(result.url).toBe(url)
    })

    it("handles GitHub URL with special mock", async () => {
        const url = "https://github.com/user/repo"
        const result = await parseContent(url)

        expect(result.url).toBe(url)
        expect(result.title).toContain("GitHub")
    })

    it("handles YouTube URL with special mock", async () => {
        const url = "https://youtube.com/watch?v=abc123"
        const result = await parseContent(url)

        expect(result.url).toBe(url)
        expect(result.title).toContain("YouTube")
    })

    it("handles multiline content correctly", async () => {
        const text = "Main Title\nLine 1\nLine 2\nLine 3"
        const result = await parseContent(text)

        expect(result.title).toBe("Main Title")
        expect(result.content).toBe("Line 1\nLine 2\nLine 3")
    })

    it("truncates long descriptions", async () => {
        const longContent = "Title\n" + "a".repeat(200)
        const result = await parseContent(longContent)

        expect(result.description.length).toBeLessThanOrEqual(100)
    })

    // Invalid URL handling
    it("treats non-URL text as note even if it looks URL-like", async () => {
        const text = "http but not a url"
        const result = await parseContent(text)

        expect(result.url).toBeUndefined()
        expect(result.title).toBe("http but not a url")
    })

    it("handles ftp protocol as non-URL", async () => {
        const text = "ftp://files.example.com"
        const result = await parseContent(text)

        // Our parser only recognizes http/https
        expect(result.url).toBeUndefined()
    })
})
