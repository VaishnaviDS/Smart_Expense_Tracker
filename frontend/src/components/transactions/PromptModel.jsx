import { useState, useRef } from "react";

function PromptModal({ close, onSubmit }) {

  const [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  ////////////////////////////////////////////////////
  // 🎤 START VOICE
  ////////////////////////////////////////////////////

  const startListening = () => {

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev + " " + transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Voice recognition error");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  ////////////////////////////////////////////////////
  // STOP VOICE
  ////////////////////////////////////////////////////

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  ////////////////////////////////////////////////////
  // SUBMIT
  ////////////////////////////////////////////////////

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal">

        <h3>AI Prompt</h3>

        <textarea
          placeholder="Type or speak your transactions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="voice-buttons">
          {!listening ? (
            <button onClick={startListening}>
              🎤 Start Speaking
            </button>
          ) : (
            <button onClick={stopListening}>
              ⏹ Stop
            </button>
          )}
        </div>

        <div className="transaction-modal-buttons">
          <button onClick={handleSubmit}>
            Extract
          </button>
          <button onClick={close}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default PromptModal;