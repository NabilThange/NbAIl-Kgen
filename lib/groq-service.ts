import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
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

export const getGroqTranscription = async (audioFile: File) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3", // Or your preferred model
      response_format: "json", // Get transcription text
    });
    return transcription.text || ""; // Return the transcribed text
  } catch (error) {
    console.error("Error getting Groq transcription:", error);
    return "Sorry, there was an error transcribing the audio.";
  }
}; 