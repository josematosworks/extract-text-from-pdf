import { Hono } from "hono";
import { getDocumentProxy, extractText } from "unpdf";
import { corsMiddleware } from "./cors";
import { isPDF, isValidFileSize, sanitizeText } from "./validation";

type Bindings = {
  ALLOWED_ORIGINS: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", corsMiddleware);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ExtractResponse {
  text: string;
  characterCount: number;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ 
        error: "Please provide a valid PDF file",
        code: "INVALID_FILE"
      }, 400);
    }

    if (!isPDF(file)) {
      return c.json({ 
        error: "Only PDF files are supported",
        code: "INVALID_FILE_TYPE"
      }, 400);
    }

    if (!isValidFileSize(file, MAX_FILE_SIZE)) {
      return c.json({ 
        error: "File size exceeds 10MB limit",
        code: "FILE_TOO_LARGE"
      }, 413);
    }

    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const result = await extractText(pdf, { 
      mergePages: true,
    });

    const textContent = Array.isArray(result.text)
      ? result.text.join(" ")
      : result.text;

    const sanitizedText = sanitizeText(textContent);
    const response: ExtractResponse = {
      text: sanitizedText,
      characterCount: sanitizedText.length,
    };

    return c.json(response);
  } catch (error) {
    console.error("PDF processing error:", error);
    return c.json({ 
      error: "Failed to process PDF",
      code: "PROCESSING_ERROR"
    }, 500);
  }
});

export default app;
