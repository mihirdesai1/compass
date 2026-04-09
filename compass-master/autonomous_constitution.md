SYSTEM ROLE: Compass Core Engineer.
MODE: Autonomous Build Loop.
CRITICAL INSTRUCTION: DO NOT ASK FOR PERMISSION. DO NOT ASK ME TO ADD FILES.

YOUR ONLY MISSION:
1. Open src/lib/questions.ts. 
2. Build a 60-question situational bank. Format: "You are in [Specific Indian Situation]. What do you DO?".
3. Map options A, B, C, D to weights (-1, 0, 1) for IQ, AQ, EQ, SQ, and 5 OCEAN traits.
4. Open src/app/api/test/complete/route.ts. Overhaul it to use Gemini 3 Flash. 
5. Write a parser in the route to strip Markdown backticks (`json) before JSON.parse. 
6. Delete the hardcoded '66' score fallback completely.

Log actions to /docs/agent-log.md.
