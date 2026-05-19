import asyncHandler from 'express-async-handler';
// import Anthropic from '@anthropic-ai/sdk';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';



//@desc Review a resume against a job description
//@route POST /api/review
//access Public
// const reviewResume = asyncHandler(async(req, res) => {
//     const client = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY}); //initalize the Anthropic client
//     const {jobDescription, resume} = req.body;

//     if(!jobDescription || !resume) {
//         res.status(400);
//         throw new Error("Missing job description or resume");
//     }

//     // these headers switch the response from a normal JSON response
//     // to a Server-Sent Events stream — the client stays connected
//     // and receives data in chunks as the AI generates it
//     res.header("Content-Type", "text/event-stream");
//     res.header("Cache-Control", "no-cache"); // Disable caching
//     res.header("Connection", "keep-alive"); // Keep the connection open

//     // client.messages.stream() opens a streaming connection to Claude
//     // instead of waiting for the full response, we get chunks as they arrive
//     const stream = await client.messages.stream({
//     model: 'claude-sonnet-4-6',  // the Claude model we're using
//     max_tokens: 1024,                    // maximum length of the response
    
//     // the system prompt defines Claude's role and the exact output format
//     // being very specific here is what makes the output parseable JSON later
//     system: `You are an expert technical recruiter. Analyse the resume against 
//     the job description and return ONLY a valid JSON object with no markdown, no 
//     explanation, just the raw JSON in this exact shape:
//     {
//     "score": number between 0 and 100,
//     "strengths": ["string", "string", "string"],
//     "gaps": ["string", "string"],
//     "suggestions": ["string", "string", "string"]
//     }`,
//         messages: [{
//         role: 'user',
//         // template literal to inject the actual job description and resume into the prompt
//         content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resume}`
//         }]
//     });

//     //iterate over each chunk
//     for await (const chunk of stream) {
//         // Claude sends many event types — we only care about text delta events
//         // which contain the actual generated text fragments
//         if(chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
//             // SSE format requires each message to be prefixed with "data: "
//             // and end with two newlines — the client uses this to split chunks
//             res.write(`data: ${chunk.delta.text}\n\n`);
//         }
//     }

//     // For now, send a small SSE message to indicate the stream started and close the connection.
//     res.write('data: [DONE]\n\n');
//     res.end();
// });


//@desc   Review a resume against a job description
//@route  POST /api/review
//@access Public
// const reviewResume = asyncHandler(async (req, res) => {

//   // initialize Gemini client with our API key
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//   // gemini-1.5-flash is free and fast — good for structured output tasks
//   const model = genAI.getGenerativeModel({
//     model: 'gemini-2.0-flash',
//     // system instruction tells Gemini its role — same as our system prompt before
//     systemInstruction: `You are an expert technical recruiter. Analyse the resume against the job description and return ONLY a valid JSON object with no markdown, no explanation, just the raw JSON in this exact shape:
// {
//   "score": number between 0 and 100,
//   "strengths": ["string", "string", "string"],
//   "gaps": ["string", "string"],
//   "suggestions": ["string", "string", "string"]
// }`,
//   });

//   const { jobDescription, resume } = req.body;

//   if (!jobDescription || !resume) {
//     res.status(400);
//     throw new Error('Missing job description or resume');
//   }

//   // switch response to Server-Sent Events stream
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   // generateContentStream() streams the response chunk by chunk
//   const result = await model.generateContentStream(
//     `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resume}`
//   );

//   // iterate over chunks as Gemini generates them
//   for await (const chunk of result.stream) {
//     const text = chunk.text(); // extract the text from each chunk
//     if (text) {
//       // same SSE format the React client already expects — no frontend changes needed
//       res.write(`data: ${text}\n\n`);
//     }
//   }

//   res.write('data: [DONE]\n\n');
//   res.end();
// });


//@desc   Review a resume against a job description
//@route  POST /api/review
//@access Public
const reviewResume = asyncHandler(async (req, res) => {

  // initialize Groq client — reads GROQ_API_KEY from .env
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const { jobDescription, resume } = req.body;

  if (!jobDescription || !resume) {
    res.status(400);
    throw new Error('Missing job description or resume');
  }

  // switch response to Server-Sent Events stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Groq's API follows the OpenAI format — messages array with role/content
  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // free, fast, and very capable
    max_tokens: 1024,
    stream: true, // enable streaming
    messages: [
      {
        role: 'system',
        content: `You are an expert technical recruiter. Analyse the resume against the job description and return ONLY a valid JSON object with no markdown, no explanation, just the raw JSON in this exact shape:
{
  "score": number between 0 and 100,
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string"],
  "suggestions": ["string", "string", "string"]
}`
      },
      {
        role: 'user',
        // inject both inputs into the prompt
        content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resume}`
      }
    ]
  });

  // iterate over chunks as Groq streams them
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) {
      // same SSE format the React client already expects
      res.write(`data: ${text}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

export default reviewResume;