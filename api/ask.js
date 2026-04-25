module.exports = async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "Ask something first" });
    }

    async function callAI() {
      return await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: question
          })
        }
      );
    }

    let response = await callAI();
    let data = await response.json();

    // 🔁 retry once if failed
    if (data?.error || !data) {
      await new Promise(r => setTimeout(r, 2000));
      response = await callAI();
      data = await response.json();
    }

    let answer = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.generated_text) {
      answer = data.generated_text;
    } else {
      answer = "AI is busy right now — try again in a few seconds.";
    }

    res.status(200).json({ answer });

    });
  }
};
