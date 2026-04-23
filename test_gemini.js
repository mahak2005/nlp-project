require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch(e) {
    console.error("gemini-1.5-flash failed:", e.message);
  }
  try {
    const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result2 = await model2.generateContent("hello");
    console.log(result2.response.text());
  } catch(e) {
    console.error("gemini-1.5-flash-latest failed:", e.message);
  }
  try {
    const model3 = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result3 = await model3.generateContent("hello");
    console.log(result3.response.text());
  } catch(e) {
    console.error("gemini-pro failed:", e.message);
  }
}
run();
