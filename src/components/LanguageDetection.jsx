import React, { useState, useEffect } from "react";

// Language code to full name mapping
const languageNames = {
  en: "English",
  fr: "French",
  es: "Spanish",
  pt: "Portuguese",
  tr: "turkish",
  ru: "Russian",
  // Add more languages as needed
};

const LanguageDetection = () => {
  const [text, setText] = useState(""); // User input
  const [detectedLanguage, setDetectedLanguage] = useState(null); // Detected language object
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const detectLanguage = async () => {
      if (!text.trim()) {
        setDetectedLanguage(null); // Reset if text is empty
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Check if the language detector API exists
        if (!window.ai || !window.ai.languageDetector) {
          console.error(
            "Language Detector API is not available in this browser."
          );
          setError("Language Detector API is not available.");
          setLoading(false);
          return;
        }

        console.log("API detected. Proceeding with language detection...");

        // Create language detector instance
        const detector = await window.ai.languageDetector.create();
        console.log("Language Detector Instance Created:", detector);

        // Detect language from input text
        const results = await detector.detect(text);
        console.log("Detected Language Results:", results);

        // Extract the most relevant detected language (highest confidence)
        if (Array.isArray(results) && results.length > 0) {
          const topLanguage = results[0]; // Pick the most confident result
          console.log("Top Detected Language:", topLanguage);

          setDetectedLanguage(topLanguage); // Save to state
        } else {
          console.log("No valid language detected.");
          setDetectedLanguage(null);
        }
      } catch (error) {
        console.error("Error detecting language:", error);
        setError("Failed to detect language. See console for details.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce input to avoid excessive API calls
    const debounceTimeout = setTimeout(detectLanguage, 500);
    return () => clearTimeout(debounceTimeout);
  }, [text]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Real-Time Language Detector</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something here..."
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      {loading && <p>Detecting language...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {detectedLanguage && text.trim() && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>
            i am {detectedLanguage.confidence?.toFixed(2)} sure that this is{" "}
            {languageNames[detectedLanguage.detectedLanguage] || "Unknown"}{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default LanguageDetection;
