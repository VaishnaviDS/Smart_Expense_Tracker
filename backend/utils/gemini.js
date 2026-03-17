import axios from "axios";
import fs from "fs";
import crypto from "crypto";

const DEFAULT_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Medical",
  "Bills",
  "Entertainment",
  "Other"
];

//////////////////////////////////////////////////////////////
// ✅ SAFE JSON PARSER
//////////////////////////////////////////////////////////////

function safeParseJSON(text) {
  try {
    const clean = text
      .replace(/```json|```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

//////////////////////////////////////////////////////////////
// ✅ RETRY WRAPPER (VERY IMPORTANT)
//////////////////////////////////////////////////////////////

export async function callGeminiWithRetry(payload, maxRetries = 2) {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000
        }
      );

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = safeParseJSON(text);

      if (!parsed) {
        throw new Error("Invalid JSON returned");
      }

      return parsed;

    } catch (err) {
      lastError = err.response?.data || err.message;
      console.log(`Attempt ${attempt + 1} failed:`, lastError);
    }
  }

  throw new Error(`AI failed after retries: ${JSON.stringify(lastError)}`);
}

//////////////////////////////////////////////////////////////
// ✅ FILE HASH
//////////////////////////////////////////////////////////////

export function generateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

//////////////////////////////////////////////////////////////
// ✅ MULTIPLE EXPENSE FROM TEXT
//////////////////////////////////////////////////////////////

export const extractExpensesFromText = async (
  promptText,
  userCategories = []
) => {
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...userCategories])];
  const today = new Date().toISOString().split("T")[0];

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
You are an expense parser AI.

Today's date is ${today}.

STRICT RULES:
- Convert yesterday/today/tomorrow to YYYY-MM-DD.
- If date missing, assume today.
- total_amount must be number only.
- merchant_name must NOT be empty.
- category must be from:
${categories.join(", ")}

Return STRICT JSON ARRAY.

User text:
"${promptText}"
`
          }
        ]
      }
    ]
  };

  const parsed = await callGeminiWithRetry(payload);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("No valid expenses detected");
  }

  return parsed;
};

//////////////////////////////////////////////////////////////
// ✅ RECEIPT EXTRACTION
//////////////////////////////////////////////////////////////

export const extractExpenseFromReceipt = async (
  filePath,
  mimeType,
  userCategories = []
) => {
  const base64File = fs.readFileSync(filePath, {
    encoding: "base64"
  });

  const categories = [...new Set([...DEFAULT_CATEGORIES, ...userCategories])];

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
Extract:
- total_amount (number)
- date (YYYY-MM-DD)
- merchant_name
- category ONLY from:
${categories.join(", ")}

Return STRICT JSON object.
`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64File
            }
          }
        ]
      }
    ]
  };

  const parsed = await callGeminiWithRetry(payload);

  if (!parsed.total_amount || !parsed.merchant_name) {
    throw new Error("Incomplete expense data from AI");
  }

  return parsed;
};
export const generateInsights = async (expenses) => {
  try {

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
You are a financial assistant.

Analyze the user's expenses and provide short insights.

Expenses:
${JSON.stringify(expenses)}

Return STRICT JSON:
{
 "top_category": "",
 "unusual_spending": "",
 "saving_suggestion": ""
}
`
            }
          ]
        }
      ]
    };

    const parsed = await callGeminiWithRetry(payload);

    return parsed;

  } catch (error) {

    // fallback if quota reached
    if (error.response?.status === 429 || error.message?.includes("quota")) {
      return {
        top_category: "Unavailable",
        unusual_spending: "AI quota reached",
        saving_suggestion: "Try again later"
      };
    }

    throw error;
  }
};

export const extractIncomeFromText = async (
  promptText,
  userCategories = []
) => {

  const categories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other",
    ...userCategories
  ];

  const today = new Date().toISOString().split("T")[0];

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
You are an income parser AI.

Today's date is ${today}.

Rules:
- Convert natural dates to YYYY-MM-DD
- amount must be number
- source must not be empty
- category must be from:
${categories.join(", ")}

Return STRICT JSON ARRAY.

User text:
"${promptText}"
`
          }
        ]
      }
    ]
  };

  const parsed = await callGeminiWithRetry(payload);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("No valid income detected");
  }

  return parsed;
};

export const extractIncomeFromReceipt = async (
  filePath,
  mimeType
) => {

  const base64File = fs.readFileSync(filePath, {
    encoding: "base64"
  });

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
Extract:
- total_amount
- date (YYYY-MM-DD)
- source
- category

Return STRICT JSON object.
`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64File
            }
          }
        ]
      }
    ]
  };

  const parsed = await callGeminiWithRetry(payload);

  if (!parsed.total_amount || !parsed.source) {
    throw new Error("Incomplete income data");
  }

  return parsed;
};
export const detectReceiptType = async (filePath, mimeType) => {

  const base64File = fs.readFileSync(filePath, {
    encoding: "base64"
  });

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `
Analyze the receipt.

Classify it as:
"income" OR "expense"

Examples:
Salary slip → income
Bank credit receipt → income
Restaurant bill → expense
Shopping bill → expense

Return STRICT JSON:
{ "type": "" }
`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64File
            }
          }
        ]
      }
    ]
  };

  const parsed = await callGeminiWithRetry(payload);

  return parsed.type;
};