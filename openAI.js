const OpenAI = require("openai");
require("dotenv/config");

const openAi = async (caption) =>  {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `${caption} 친구처럼 답해줘.` }],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;
} 

export default openAi;