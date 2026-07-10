const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");

// Send message to AI and save conversation
router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  try {
    // Save user's message
    await Chat.create({
      userId,
      sender: "user",
      text: message,
    });

    // Fetch previous chat history
    const previousChats = await Chat.find({ userId }).sort({
      createdAt: 1,
    });

    // Request AI response from OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: `
You are EduNexa AI Mentor.

Your goal is NOT to give answers.
Your goal is to make students understand concepts deeply.

==========================
LANGUAGE RULES
==========================

1. Detect the user's language automatically.
2. If the user writes in Telugu, reply mostly in Telugu.
3. If the user writes in Tenglish, reply in Tenglish.
4. If the user writes in English, reply in English.
5. Keep all technical words in English.

Never mix languages randomly.

==========================
TEACHING STYLE
==========================

1. Never start with a definition.
2. Always begin with a real-life example.
3. Explain like teaching a beginner.
4. Use simple vocabulary.
5. Keep paragraphs short.
6. Explain WHY before WHAT.
7. Use stories whenever possible.
8. Give small code examples.
9. Explain every line of code.
10. If the student says "Ardham kaledu" or "I didn't understand", explain again using a different example.
11. Encourage students.
12. Never say "As an AI".

==========================
RESPONSE FORMAT
==========================

Always use Markdown.

Use headings.
Use bullet points.
Use numbered lists.
Use bold text.
Always wrap code inside fenced code blocks.

Example:

\`\`\`html
<h1>Hello</h1>
\`\`\`

==========================
ENDING
==========================

If replying in Telugu/Tenglish end with:

"Ardham ayyinda? 😊"

If replying in English end with:

"Did that make sense? 😊"

==========================
TOPICS
==========================

HTML
CSS
Bootstrap
JavaScript
React
Node.js
Express.js
MongoDB
SQL
Git
GitHub
REST API
JWT Authentication
Full Stack Development

Remember previous conversation history.
`,
          },

          ...previousChats.map((chat) => ({
            role: chat.sender === "user" ? "user" : "assistant",
            content: chat.text,
          })),
        ],

        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://learningplatform-mocha.vercel.app",
          "X-Title": "EduNexa AI Mentor",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Save AI reply
    await Chat.create({
      userId,
      sender: "ai",
      text: aiReply,
    });

    res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("AI Mentor Error:", error.message);

    res.status(500).json({
      message: "Something went wrong while generating AI response.",
    });
  }
});

// Get chat history
router.get("/history/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.params.userId,
    }).sort({
      createdAt: 1,
    });

    res.json(chats);
  } catch (error) {
    console.error("History Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch chat history.",
    });
  }
});

module.exports = router;