# Extract Text From PDF

A Cloudflare Worker API that extracts text content from PDF files using unpdf. This service provides a simple and efficient way to extract text from PDF documents through a REST API.

## Features

- PDF text extraction using unpdf
- CORS support with configurable origins
- Returns extracted text and character count
- Built with Hono.js for efficient routing and handling
- Deployed on Cloudflare Workers platform
- Automatic deployment via GitHub Actions
- TypeScript support
- Input validation and sanitization
- Error handling with detailed responses

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Cloudflare Workers account
- wrangler CLI tool

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/extract-text-from-pdf.git
cd extract-text-from-pdf
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Add the following to your `.env`:
```env
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

## Development

Available commands:

```bash
# Start development server
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

## Deployment

### Automatic Deployment
The project automatically deploys to Cloudflare Workers via GitHub Actions when pushing to the main branch. The deployment requires the following secrets to be set in your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### Manual Deployment
To deploy manually:
```bash
npm run deploy
```

## API Reference

### POST /upload

Extracts text from a PDF file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: 
  - `file`: PDF file (required)
- Size Limit: 10MB

**Response:**
```typescript
interface ExtractResponse {
  text: string;
  characterCount: number;
}

interface ErrorResponse {
  error: string;
  code: string;
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid request (non-PDF file or missing file)
- `413`: File too large (>10MB)
- `500`: Server error

**Error Codes:**
- `INVALID_FILE`: No file provided or invalid file
- `INVALID_FILE_TYPE`: File is not a PDF
- `FILE_TOO_LARGE`: File exceeds size limit
- `PROCESSING_ERROR`: Error processing the PDF

## Usage Examples

### cURL
```bash
curl -X POST https://your-worker-url.com/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/file.pdf"
```

### JavaScript
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

try {
  const response = await fetch('https://your-worker-url.com/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`Extracted ${data.characterCount} characters`);
  console.log(data.text);
} catch (error) {
  console.error('Error:', error);
}
```

## CORS Configuration

The API implements CORS protection with:
- Configurable allowed origins via environment variable
- Only POST method allowed
- Credentials support
- 24-hour cache (maxAge)
- Content-Type header allowed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [unpdf](https://github.com/unpdf/unpdf) for PDF text extraction
- [Hono](https://github.com/honojs/hono) for the web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) for hosting