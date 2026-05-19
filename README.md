# AI Resume Reviewer

A fullstack AI-powered web app that analyses your resume against a job description and returns structured feedback — including a match score, strengths, gaps, and actionable suggestions.

Built with React, Node.js, Express, TypeScript, and Groq (LLaMA 3.3).

---

## Features

- Paste any job description and resume text
- Streams AI feedback in real time using Server-Sent Events (SSE)
- Returns structured output: match score, strengths, gaps, and top suggestions
- Clean error handling with global error middleware
- Swap AI provider easily (Groq, Anthropic, Gemini)

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Custom `useReview` hook for streaming

**Backend**
- Node.js + Express + TypeScript
- Groq SDK (LLaMA 3.3 70B)
- Server-Sent Events for streaming
- `express-async-handler` for clean async error handling

---

## Project Structure

```
resume-reviewer/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── ReviewForm.tsx     # Job description + resume inputs
│       │   └── ReviewResult.tsx   # Renders score, strengths, gaps, suggestions
│       ├── hooks/
│       │   └── useReview.ts       # Streaming logic + state management
│       └── App.tsx
│
└── server/                        # Express backend
    └── src/
        ├── controllers/
        │   └── reviewController.ts  # AI streaming logic
        ├── middlewares/
        │   └── errorMiddleware.ts   # Global error + notFound handlers
        ├── routes/
        │   └── reviewRouter.ts      # POST /api/review
        └── index.ts                 # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/resume-reviewer.git
cd resume-reviewer
```

### 2. Set up the server

```bash
cd server
pnpm install
```

Create a `.env` file inside `server/`:

```
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

Start the server:

```bash
pnpm dev
```

Server runs on `http://localhost:3001`

### 3. Set up the client

```bash
cd client
pnpm install
pnpm dev
```

Client runs on `http://localhost:5173`

---

## How It Works

1. User pastes a job description and resume into the form
2. React sends a `POST` request to `/api/review`
3. The Express server opens a streaming connection to Groq (LLaMA 3.3 70B)
4. The AI response streams back chunk by chunk via Server-Sent Events
5. Once the stream completes, the client parses the JSON and renders result cards

```
React (POST) → Express → Groq API
                  ↓
React ← SSE stream ← chunks arrive in real time
```

---

## API

### `POST /api/review`

**Request body:**
```json
{
  "jobDescription": "string",
  "resume": "string"
}
```

**Streaming response (SSE):**
```
data: {"score":
data:  82, "strengths":
data:  ["React.js expertise"...
data: [DONE]
```

**Parsed result shape:**
```json
{
  "score": 82,
  "strengths": ["3+ years React experience", "Strong TypeScript skills", "REST API expertise"],
  "gaps": ["No cloud platform experience", "No CI/CD pipeline mentioned"],
  "suggestions": [
    "Add AWS or GCP projects to your portfolio",
    "Mention any CI/CD tools used at previous roles",
    "Highlight your OAuth 2.0 project more prominently"
  ]
}
```

---

## Switching AI Providers

The backend is designed to swap providers easily. Currently using Groq — to switch to Anthropic once you have credits:

```typescript
// reviewController.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  ...
});
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (optional) |
| `NODE_ENV` | `development` or `production` |

---

## What I Learned Building This

- How to integrate LLM APIs (Anthropic, Groq, Gemini) into a Node.js backend
- Server-Sent Events (SSE) for real-time streaming responses
- Prompt engineering for structured JSON output
- Clean Express architecture with controllers, routes, and middleware
- Handling streamed JSON on the React client with `ReadableStream`

---

## Roadmap

- [ ] Save review history to MongoDB
- [ ] User authentication (JWT)
- [ ] PDF resume upload support
- [ ] Side-by-side diff view of resume vs job description
- [ ] Switch back to Claude (Anthropic) as primary model

---

## License

MIT
