export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  description = "",
  company = "",
  numberOfQuestions = 10,
  recentContext = "",
) => {
  return `You are a senior engineer conducting a technical interview.

Generate exactly ${numberOfQuestions} interview questions for the following profile:
- Role: ${role}
- Experience: ${experience} years
- Topics to focus on: ${topicsToFocus || "general topics for this role"}
- Target company or domain: ${company || "general product/company interviews"}
- Candidate context: ${description || "No additional context provided"}
${recentContext ? `- Recent interview signals:\n${recentContext}` : ""}

Rules for each question:
1. The "answer" must be directly tailored to the user profile and context (role, experience, company style, and focus topics). Avoid generic textbook wording.
2. The "answer" field must use this exact structure in markdown:
   - **Direct Answer:** 2-3 lines, plain and exact.
   - **Practical Example:** one realistic implementation or debugging scenario for this role.
   - **Trade-off / Lesson:** 1-2 lines on decision, risk, or learning.
   - Optional short \`\`\`js ... \`\`\` block only if it improves clarity (under 10 lines).
3. Keep each answer concise (120-220 words), technically correct, and matched to ${experience} years of experience.
4. Do NOT include meta coaching text like "How to answer well", "you should say", or interview tip templates.
5. Use the recent interview signals to align with what candidates are currently being asked, while keeping answers practical and role-specific.

Return ONLY a valid JSON array. No extra text, no markdown wrapper around the JSON.

[
  {
    "question": "...",
    "answer": "**Direct Answer:** ...\\n\\n**Practical Example:** ...\\n\\n**Trade-off / Lesson:** ..."
  }
]`;
};

export const conceptExplainPrompt = (question) => {
  return `You are a senior developer explaining a concept to a junior developer.

Explain the following interview question in depth:
"${question}"

Structure your explanation like this:
1. Start with a **one-line definition** in bold.
2. Explain the concept in 2-3 short paragraphs.
3. Use bullet points for any list of features, pros/cons, or steps.
4. If relevant, include a small code example (under 10 lines) in a \`\`\`js block.
5. End with a **"Key Takeaway"** line summarizing the concept in one sentence.

Return ONLY a valid JSON object in this exact shape. No extra text outside the JSON:

{
  "title": "Short, clear concept title (5 words max)",
  "explanation": "**Definition:** ...\\n\\n Paragraph...\\n\\n**Key Takeaway:** ..."
}`;
};

export const regenerateAnswerPrompt = ({
  role,
  experience,
  company = "",
  topicsToFocus = "",
  description = "",
  question,
  userInput = "",
}) => `You are a senior interviewer writing a high-quality model answer.

Candidate profile:
- Role: ${role}
- Experience: ${experience} years
- Company/domain: ${company || "general"}
- Focus topics: ${topicsToFocus || "general"}
- Context: ${description || "not provided"}

Question:
"${question}"

User requirement for this regenerated answer:
"${userInput || "Make it practical and project-based"}"

Write one concise answer in markdown with this exact structure:
1. **Direct Answer:** 2-3 lines, exact and clear.
2. **Practical Example:** one realistic implementation/debugging example.
3. **Trade-off / Lesson:** 1-2 lines with decision or lesson.
4. Optional short \`\`\`js code block if needed (max 10 lines).

Do not include interview coaching templates.
Return ONLY valid JSON object:
{
  "answer": "..."
}`;
