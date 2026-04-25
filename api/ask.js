export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "No question received" });
    }

    console.log("KEY EXISTS:", !!process.env.HF_API_KEY);

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

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(200).json({
        answer: "AI returned invalid response. Try again."
      });
    }

    let answer = "";

    if (data?.generated_text) {
      answer = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.error) {
      answer = "Model loading... wait 15 seconds and try again.";
    } else {
      answer = "AI did not respond properly.";
    }

    res.status(200).json({ answer });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      answer: "Server error (check logs)"
    });
  }
}
