module.exports = async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "No question received" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
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

    const data = await response.json();

    let answer = "";

    if (data?.generated_text) {
      answer = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.error) {
      answer = "Model loading... try again in 10–15 seconds";
    } else {
      answer = "AI not responding properly";
    }

    res.status(200).json({ answer });

  } catch (error) {
    res.status(500).json({
      answer: "Error connecting to free AI"
    });
  }
};
