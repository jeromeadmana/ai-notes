import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_SUMMARY_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
//const HF_TITLE_URL = "https://api-inference.huggingface.co/models/gpt2";
const HF_TITLE_URL = "https://api-inference.huggingface.co/models/distilgpt2";

export const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await axios.post(
      HF_SUMMARY_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const summary = response.data[0]?.summary_text || "No summary generated";
    res.json({ summary });
  } catch (err) {
    console.error("🔥 Summarize API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

export const suggestTitle = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const prompt = `Generate a short and catchy title for this note:\n\n${text}\n\nTitle:`;
    const response = await axios.post(
      HF_TITLE_URL,
      { inputs: prompt, parameters: { max_new_tokens: 15 } },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const rawOutput = response.data[0]?.generated_text || "Untitled Note";

    // Extract only the part after "Title:" if present
    const title = rawOutput.split("Title:").pop().trim();

    res.json({ title: title || "Untitled Note" });
  } catch (err) {
    console.error("🔥 Title API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
