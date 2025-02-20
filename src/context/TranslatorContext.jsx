import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const TranslatorContext = createContext();

// Provider Component
export const TranslatorProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [summarizedText, setSummarizedText] = useState("");
  const [showSummarizeButton, setShowSummarizeButton] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [error, setError] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const detectLanguage = async () => {
      if (!text.trim()) return;

      try {
        if (!window.ai || !window.ai.languageDetector) {
          setError("Language Detector API is not available.");
          return;
        }

        const detector = await window.ai.languageDetector.create();
        const results = await detector.detect(text);

        if (results.length > 0) {
          setDetectedLanguage(results[0]);
        }
      } catch (error) {
        setError("Failed to detect language.");
      }
    };

    const debounceTimeout = setTimeout(detectLanguage, 500);
    return () => clearTimeout(debounceTimeout);
  }, [text]);

  const handleMoveText = () => {
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    setSubmittedText(text);
    setText("");
    setTranslatedText("");
    setSummarizedText("");
    setShowSummarizeButton(text.split(/\s+/).length > 150);
  };

  const handleTranslate = async () => {
    if (!submittedText.trim()) {
      setError("No text to translate.");
      return;
    }

    setIsTranslating(true);
    setIsSummarizing(false); // Reset summarize button

    try {
      if (!window.ai || !window.ai.translator) {
        setError("Chrome AI APIs are not enabled.");
        return;
      }

      const translator = await window.ai.translator.create({
        sourceLanguage: "en",
        targetLanguage,
      });

      const result = await translator.translate(submittedText);
      setTranslatedText(result);
    } catch (error) {
      setError("Error translating text.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSummarize = async () => {
    if (!submittedText.trim()) {
      setError("No text to summarize.");
      return;
    }

    setIsSummarizing(true);
    setIsTranslating(false); // Reset translate button

    try {
      if (!window.ai || !window.ai.summarizer) {
        setError("Chrome AI Summarization API is not available.");
        return;
      }

      const summarizer = await window.ai.summarizer.create();
      const result = await summarizer.summarize(submittedText);
      setSummarizedText(result);
    } catch (error) {
      setError("Error summarizing text.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <TranslatorContext.Provider
      value={{
        text,
        setText,
        submittedText,
        translatedText,
        targetLanguage,
        setTargetLanguage,
        summarizedText,
        showSummarizeButton,
        detectedLanguage,
        error,
        isTranslating,
        isSummarizing,
        handleMoveText,
        handleTranslate,
        handleSummarize,
      }}
    >
      {children}
    </TranslatorContext.Provider>
  );
};

// Custom hook to use the context
export const useTranslator = () => useContext(TranslatorContext);
