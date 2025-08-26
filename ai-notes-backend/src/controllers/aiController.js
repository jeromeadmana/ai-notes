import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

export const summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const summary = response.data[0]?.summary_text || "No summary generated";
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const suggestTitle = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const prompt = `Suggest a short title for this note: ${text}`;
    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const title = response.data[0]?.summary_text || "Untitled Note";
    res.json({ title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
