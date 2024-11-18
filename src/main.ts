import { Hono } from "hono";
import { cors } from 'hono/cors';
import { getDocumentProxy, extractText } from "unpdf";

type Bindings = {
  ALLOWED_ORIGINS: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS
    ? String(c.env.ALLOWED_ORIGINS).split(',').map(o => o.trim())
    : [];
    
  return cors({
    origin: (origin) => allowedOrigins.includes(origin) ? origin : null,
    allowMethods: ['POST'],
    maxAge: 86400,
  })(c, next);
});

interface ExtractResponse {
  extractedText: string;
  totalChars: number;
}

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "Please provide a valid PDF file" }, 400);
    }

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
