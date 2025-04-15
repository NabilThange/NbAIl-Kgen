import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const getGroqChatCompletion = async (userMessage: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: 'llama3-8b-8192', // Or your preferred model
    });
    return chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error getting Groq chat completion:', error);
    return 'Sorry, there was an error processing your request.';
  }
}; 