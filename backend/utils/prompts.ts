export const questionAnswerPrompt = (
  role: string,
  experience: string,
  topicToFocus: string,
  numberOfQuestion: number
): string => `
        You are an AI assistant designed to help users prepare for job interviews.

        Task: 
        - Role: ${role}
        - Canadiate Experience: ${experience}
        - Topic to Focus: ${topicToFocus}
        - Write ${numberOfQuestion} interview questions.
        - For each question generate a detailed answer but begginer friendly.
        - If the answer needs code provide a code example, add a small code block inside.
        - keep formatting clean.
        - Return a pure JSON array like:
        [
          {
            "question": "What is the difference between var, let, and const in JavaScript?",
            "answer": "In JavaScript, 'var' is function-scoped and can be re-declared, 'let' is block-scoped and cannot be re-declared in the same scope, and 'const' is also block-scoped but must be initialized at declaration and cannot be reassigned."
          },
          ...
        ]
        Important: Do not add extra text. Only return valid JSON.

    `;

export const conceptExplainPrompts = (question: string): string => `
    You are an AI trained to generate explanations for interview questions.

    Task:
    - Explain the following question nd it's concepts in depth in a beginner-friendly manner.
    - Question: ${question}
    - After explaining, provide a short and clear title that summarizes the concept for the article or page Header.
    - If the answer needs code provide a code example, add a small code block inside.
    - Return the result as a valid JSON object in the following format.
            - Return a pure JSON array like:
        [
          {
            "question": "What is the difference between var, let, and const in JavaScript?",
            "answer": "In JavaScript, 'var' is function-scoped and can be re-declared, 'let' is block-scoped and cannot be re-declared in the same scope, and 'const' is also block-scoped but must be initialized at declaration and cannot be reassigned."
          },
          ...
        ]
        Important: Do not add extra text. Only return valid JSON.
    `;
