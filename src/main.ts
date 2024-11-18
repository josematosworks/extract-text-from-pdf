import { Hono } from "hono";
import { getDocumentProxy, extractText } from "unpdf";

const app = new Hono();

// Define response type for better type safety
interface ExtractResponse {
  extractedText: string;
  totalChars: number;
}

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    // Improved type checking and error message
    if (!file || !(file instanceof File)) {
      return c.json({ error: "Please provide a valid PDF file" }, 400);
    }

    // Add file type validation
    if (!file.type.includes("pdf")) {
      return c.json({ error: "Only PDF files are supported" }, 400);
    }

    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const result = await extractText(pdf, { mergePages: true });

    const textContent = Array.isArray(result.text)
      ? result.text.join(" ")
      : result.text;

    const response: ExtractResponse = {
      extractedText: textContent,
      totalChars: textContent.length,
    };

    return c.json(response);
  } catch (error) {
    console.error("PDF processing error:", error);
    return c.json({ error: "Failed to process PDF" }, 500);
  }
});

export default app;
