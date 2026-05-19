import asyncHandler from 'express-async-handler';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY}); //initalize the Anthropic client

//@desc Review a resume against a job description
//@route POST /api/review
//access Public
const reviewResume = asyncHandler(async(req, res) => {
    const {jobDescription, resume} = req.body;

    if(!jobDescription || !resume) {
        res.status(400);
        throw new Error("Missing job description or resume");
    }

    // these headers switch the response from a normal JSON response
    // to a Server-Sent Events stream — the client stays connected
    // and receives data in chunks as the AI generates it
    res.header("Content-Type", "text/event-stream");
    res.header("Cache-Control", "no-cache"); // Disable caching
    res.header("Connection", "keep-alive"); // Keep the connection open

    // client.messages.stream() opens a streaming connection to Claude
    // instead of waiting for the full response, we get chunks as they arrive
    const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',  // the Claude model we're using
    max_tokens: 1024,                    // maximum length of the response
    
    // the system prompt defines Claude's role and the exact output format
    // being very specific here is what makes the output parseable JSON later
    system: `You are an expert technical recruiter. Analyse the resume against 
    the job description and return ONLY a valid JSON object with no markdown, no 
    explanation, just the raw JSON in this exact shape:
    {
    "score": number between 0 and 100,
    "strengths": ["string", "string", "string"],
    "gaps": ["string", "string"],
    "suggestions": ["string", "string", "string"]
    }`,
        messages: [{
        role: 'user',
        // template literal to inject the actual job description and resume into the prompt
        content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resume}`
        }]
    });

    //iterate over each chunk
    for await (const chunk of stream) {
        // Claude sends many event types — we only care about text delta events
        // which contain the actual generated text fragments
        if(chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            // SSE format requires each message to be prefixed with "data: "
            // and end with two newlines — the client uses this to split chunks
            res.write(`data: ${chunk.delta.text}\n\n`);
        }
    }

    // For now, send a small SSE message to indicate the stream started and close the connection.
    res.write('data: [DONE]\n\n');
    res.end();
})

export default reviewResume;