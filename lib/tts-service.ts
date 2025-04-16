/**
 * Uses the browser's SpeechSynthesis API to speak the provided text.
 * Manages speaking state via callbacks.
 *
 * @param text The text to speak.
 * @param onStart Callback function when speech starts.
 * @param onEnd Callback function when speech ends.
 * @param onError Callback function on speech error.
 */
export const speakText = (
  text: string,
  onStart: () => void,
  onEnd: () => void,
  onError: (error: SpeechSynthesisErrorEvent) => void,
) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported.");
    onError(new SpeechSynthesisErrorEvent("error", { error: "Speech synthesis not supported", utterance: null }));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onError;
  
  // Optional: Select a voice
  // const voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices[/* index of desired voice */]; 

  window.speechSynthesis.speak(utterance);
}; 