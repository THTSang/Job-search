# CV Evaluation API

AI-powered CV/Resume evaluation API with chat interface.

## Features

- Upload PDF resumes and automatically extract content
- Chat with AI to get feedback and improvement suggestions
- Vietnamese language support
- 10 chat messages per session limit

## Tech Stack

- **Runtime:** Node.js + Express
- **AI:** Groq API (Llama 3.3 70B)
- **PDF Parser:** pdf-parse
- **Validation:** Zod

## Installation

```bash
# Clone repo
git clone https://github.com/<username>/cv-evaluation.git
cd cv-evaluation

# Install dependencies
npm install

# Create .env file with your Groq API key
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

Get a free API key at: https://console.groq.com

## Run Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/evaluate/upload` | Upload CV (PDF) |
| POST | `/ai/evaluate/chat` | Chat with AI about CV |
| GET | `/ai/evaluate/:sessionId` | Get session details |
| GET | `/ai/evaluate` | List user's sessions |
| DELETE | `/ai/evaluate/:sessionId` | Delete session |
| POST | `/ai/evaluate/:sessionId/clear` | Reset chat (keep CV) |

## Usage

### 1. Upload CV

```bash
curl -X POST http://localhost:3000/ai/evaluate/upload \
  -F "cv=@my-cv.pdf" \
  -F "userId=user123"
```

Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-xxx",
    "filename": "my-cv.pdf",
    "numPages": 2,
    "promptInfo": { "used": 0, "remaining": 10, "max": 10 }
  }
}
```

### 2. Chat with AI

```bash
curl -X POST http://localhost:3000/ai/evaluate/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "sessionId": "uuid-xxx",
    "message": "Give me an overall assessment of my CV"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "Your CV scores 75/100...",
    "promptInfo": { "used": 1, "remaining": 9, "max": 10 }
  }
}
```

## Limits

| Limit | Value |
|-------|-------|
| Chats per session | 10 |
| Max file size | 10MB |
| Session timeout | 1 hour |
| File format | PDF only |

## Project Structure

```
src/
├── index.js              # Entry point, Express server
├── routes/
│   └── evaluate.js       # API endpoints
├── services/
│   ├── aiEvaluator.js    # Groq API integration
│   ├── pdfParser.js      # PDF text extraction
│   └── sessionStore.js   # In-memory session management
└── middleware/
    ├── validation.js     # Request validation with Zod
    └── logger.js         # Request/response logging
```

## License

MIT
