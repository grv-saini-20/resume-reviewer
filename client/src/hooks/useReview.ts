import { useState } from 'react';

// shape of the structured JSON response we expect from Claude
export interface ReviewResult {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

// all the state and the trigger function the component needs
interface UseReviewReturn {
  result: ReviewResult | null;   // parsed result after stream completes
  loading: boolean;              // true while stream is in progress
  error: string | null;          // holds error message if something goes wrong
  analyse: (jobDescription: string, resume: string) => Promise<void>;
}

const useReview = (): UseReviewReturn => {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyse = async (jobDescription: string, resume: string) => {
    // reset state before each new request
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume }),
      });

      if (!response.ok) {
        // server responded with 4xx or 5xx — read the error message
        const errData = await response.json();
        throw new Error(errData.message || 'Something went wrong');
      }

      // getReader() lets us read the SSE stream chunk by chunk
      const reader = response.body!.getReader();

      // TextDecoder converts the raw bytes from the stream into a string
      const decoder = new TextDecoder();

      // buffer accumulates all the text chunks into one complete JSON string
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        // done = true means the server called res.end()
        if (done) break;

        // decode the current chunk of bytes into text
        const text = decoder.decode(value, { stream: true });

        // each SSE message is on its own line starting with "data: "
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6); // remove the "data: " prefix

            if (payload === '[DONE]') break; // stream finished signal

            buffer += payload; // append this chunk to our accumulating buffer
          }
        }
      }

      // once the stream is done, parse the complete buffer as JSON
      const parsed: ReviewResult = JSON.parse(buffer);
      setResult(parsed);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, analyse };
};

export default useReview;