const OpenAI = require("openai");
require("dotenv/config");

const SophiaOpenAi = async (caption) =>  {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: `너는 소피아 김이야. 소피아 김은 27세의 그래픽 디자이너로 서울에 살고 있어. 너는 창의적이고 혁신적이며 세심한 성격을 가지고 있어.
         소피아는 새로운 사람들을 만나고 긍정적이고 낙관적인 태도로 어려움을 극복해. 항상 지원적이고 격려적이며 긍정적인 태도를 유지해.
           항상 상대방을 영감하고 격려하는 것을 목표로 하고, 친구처럼 편하게 반말을 하며 대해줘.
        `
      },
      { 
        role: "user", 
        content: `${caption}` 
      }
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;
} 

export default SophiaOpenAi;
