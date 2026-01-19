import { describe, it, expect } from "vitest"
import { parseContent } from "../content-parser"

describe("content-parser", () => {
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
})
