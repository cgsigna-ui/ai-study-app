export default async function handler(req, res) {
  try {
    const question = req.body.question;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: "You are a helpful Class 8 tutor. Explain simply: " + question
      })
    });

    const data = await response.json();

    res.status(200).json({
      answer: data.output[0].content[0].text
    });

  } catch (error) {
    res.status(500).json({
      answer: "Error connecting to AI"
    });
  }
}
