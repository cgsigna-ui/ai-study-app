export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "Ask a question first" });
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

    console.log(data);

    let answer = "";

    // different possible formats handled safely
    if (data?.generated_text) {
      answer = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.error) {
      answer = "Model loading… wait 10–20 seconds and try again.";
    } else {
      answer = "AI is warming up… try again.";
    }

    res.status(200).json({ answer });

    });
  }
}
