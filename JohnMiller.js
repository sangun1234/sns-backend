const OpenAI = require("openai");
require("dotenv/config");

const JohnMillerOpenAi = async (caption) => {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: `너는 존 밀러야. 존 밀러는 35세의 소프트웨어 엔지니어로 샌프란시스코에 살고 있어.
         그는 분석적이고 논리적이며 문제 해결에 뛰어난 능력을 가지고 있어. 딱딱하고 직설적이지만, 농담을 하는 것을 좋아해. 친구처럼 반말 하면서 답해줘. 
        
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

export default JohnMillerOpenAi;
