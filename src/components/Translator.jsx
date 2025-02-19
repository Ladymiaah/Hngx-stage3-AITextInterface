import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa"; // FontAwesome Send and Compress Icons

function Translator() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState(""); // Stores the entered text above
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("fr"); // Default to French
  const [summarizedText, setSummarizedText] = useState(""); // Stores summarized text
  const [showSummarizeButton, setShowSummarizeButton] = useState(false); // Controls visibility of summarize button

  const handleMoveText = () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }
    setSubmittedText(text); // Move text above
    setText(""); // Clear text area
    setTranslatedText(""); // Clear previous translation
    setSummarizedText(""); // Clear previous summarized text

    // Show summarize button if text is more than 150 words
    if (text.split(/\s+/).length > 150) {
      setShowSummarizeButton(true);
    } else {
      setShowSummarizeButton(false);
    }
  };

  const handleTranslate = async () => {
    if (!submittedText.trim()) {
      alert("No text to translate.");
      return;
    }

    setLoading(true);
    try {
      if (!window.ai || !window.ai.translator) {
        alert(
          "Chrome AI APIs are not enabled. Enable AI APIs in Chrome flags."
        );
        setLoading(false);
        return;
      }

      const translator = await window.ai.translator.create({
        sourceLanguage: "en",
        targetLanguage,
      });

      const result = await translator.translate(submittedText);
      setTranslatedText(result);

      // Detect the language of the translated text
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Error translating text.");
    } finally {
      setLoading(false);
    }
  };

  // Function to summarize the text using Chrome's inbuilt summarization API
  const handleSummarize = async () => {
    if (!submittedText.trim()) {
      alert("No text to summarize.");
      return;
    }

    setLoading(true);
    try {
      if (!window.ai || !window.ai.summarizer) {
        alert("Chrome AI Summarization API is not available.");
        setLoading(false);
        return;
      }

      const summarizer = await window.ai.summarizer.create();
      const result = await summarizer.summarize(submittedText);
      setSummarizedText(result);
    } catch (error) {
      console.error("Summarization failed:", error);
      alert("Error summarizing text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-center">
        AI Translator (English → {targetLanguage.toUpperCase()})
      </h2>

      {/* Submitted Text - Moves Above After Clicking the Icon */}
      {submittedText && (
        <div className="p-3 border rounded bg-gray-100">
          <strong>Entered Text:</strong>
          <p>{submittedText}</p>
        </div>
      )}

      {/* Target Language Selection - Below */}
      <select
        className="w-full p-2 border rounded"
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
      >
        <option value="es">Spanish (es)</option>
        <option value="fr">French (fr)</option>
        <option value="pt">Portuguese (pt)</option>
        <option value="ru">Russian (ru)</option>
        <option value="tr">Turkish (tr)</option>
      </select>

      {/* Translate Button - Appears Below Entered Text */}
      {submittedText && (
        <button
          onClick={handleTranslate}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      )}

      {/* Summarize Button - Appears if text is more than 150 words */}
      {showSummarizeButton && (
        <button
          onClick={handleSummarize}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      )}

      {/* Translated Text - Below Entered Text */}
      {translatedText && (
        <div className="p-3 border rounded bg-gray-100">
          <strong>Translated Text:</strong>
          <p>{translatedText}</p>
        </div>
      )}

      {/* Summarized Text - Below Translated Text */}
      {summarizedText && (
        <div className="p-3 border rounded bg-gray-100">
          <strong>Summarized Text:</strong>
          <p>{summarizedText}</p>
        </div>
      )}

      {/* Text Area with Send Icon */}
      <div className="relative">
        <textarea
          className="w-full p-3 border rounded resize-none"
          rows="4"
          placeholder="Enter text in English..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {/* Send Button (FontAwesome) */}
        <button
          onClick={handleMoveText}
          className="absolute right-3 top-3 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}

export default Translator;
