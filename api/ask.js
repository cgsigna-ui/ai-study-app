module.exports = async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "Ask something first" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Answer simply: ${question}`
        })
      }
    );

    const data = await response.json();

    let answer = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.generated_text) {
      answer = data.generated_text;
    } else if (data?.error) {
      answer = "AI is busy... try again in 5–10 seconds.";
    } else {
      answer = "No response, please retry.";
    }

    res.status(200).json({ answer });

  } catch (error) {
    res.status(500).json({
      answer: "Server error connecting to AI"
    });
  }
};
