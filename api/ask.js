
export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "No question received" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful Class 8 tutor. Explain simply."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();

    console.log(data); // helps debug in Vercel logs

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(200).json({
        answer: "AI did not respond (check API key)"
      });
    }

    res.status(200).json({ answer });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      answer: "Error connecting to AI"
    });
  }
}
