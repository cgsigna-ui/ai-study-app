export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({ answer: "No question received" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Answer this clearly: ${question}`
        })
      }
    );

    const data = await response.json();

    console.log(data);

    let answer = "No response from AI";

    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data?.error) {
      answer = "Model loading... try again in a few seconds";
    }

    res.status(200).json({ answer });

  } catch (error) {
    res.status(500).json({
      answer: "Error connecting to free AI"
    });
  }
}
