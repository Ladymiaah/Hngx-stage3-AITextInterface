import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useTranslator } from "../context/TranslatorContext";

const languageNames = {
  en: "English",
  fr: "French",
  es: "Spanish",
  pt: "Portuguese",
  tr: "Turkish",
  ru: "Russian",
};

const TranslatorApp = () => {
  const {
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
  } = useTranslator();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold items-center justify-center flex text-white">
        AI Translator
      </h1>
      <div className="w-full mb-10 mt-5 max-w-3xl border border-[#1F2937]  text-white rounded-3xl px-4 p-6 md:p-12">
        <div className="max-w-lg mx-auto p-6  shadow-lg rounded-lg flex flex-col space-y-4">
          <h2 className="text-lg font-bold text-center ">
            {" "}
            (En → {targetLanguage.toUpperCase()})
          </h2>

          {/* Language Detection */}
          {error && <p className="text-red-500">{error}</p>}
          {detectedLanguage && (
            <div className="p-3 border border-[#9CA3AF]  rounded bg-[#1F2937]">
              <p>
                I am {detectedLanguage.confidence?.toFixed(2)}% sure this is{" "}
                {languageNames[detectedLanguage.detectedLanguage] || "Unknown"}.
              </p>
            </div>
          )}

          {/* Submitted Text */}
          {submittedText && (
            <div className="p-3 border border-[#9CA3AF] rounded bg-[#1F2937]">
              <strong>Entered Text:</strong>
              <p>{submittedText}</p>
            </div>
          )}
          {/* Target Language Selection */}
          <select
            className="w-full p-2 border border-[#9CA3AF]  rounded-xl bg-[#374151]"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="es">Spanish (es)</option>
            <option value="fr">French (fr)</option>
            <option value="pt">Portuguese (pt)</option>
            <option value="ru">Russian (ru)</option>
            <option value="tr">Turkish (tr)</option>
          </select>

          {/* Translate Button */}
          {submittedText && (
            <button
              onClick={handleTranslate}
              className="w-full px-4 py-2 bg-[#1F2937] border border-[#9CA3AF]  text-white rounded-xl hover:bg-[#374151]"
              disabled={isTranslating || isSummarizing}
            >
              {isTranslating ? "Translating..." : "Translate"}
            </button>
          )}

          {/* Summarize Button */}
          {showSummarizeButton && (
            <button
              onClick={handleSummarize}
              className="w-full px-4 py-2 bg-[#1F2937] border border-[#9CA3AF]  text-white rounded hover:bg-[#374151]"
              disabled={isSummarizing || isTranslating}
            >
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </button>
          )}

          {/* Translated Text */}
          {translatedText && (
            <div className="p-3 border border-[#9CA3AF]  rounded bg-[#111827]">
              <strong>Translated Text:</strong>
              <p>{translatedText}</p>
            </div>
          )}

          {/* Summarized Text */}
          {summarizedText && (
            <div className="p-3 border border-[#9CA3AF]  rounded bg-gray-100">
              <strong>Summarized Text:</strong>
              <p>{summarizedText}</p>
            </div>
          )}
        </div>
      </div>
      {/* Text Area */}
      <div className="flex items-center gap-3 max-w-3xl">
        <textarea
          className="w-full max-w-3xl p-3 text-white border border-[#9CA3AF] rounded-xl resize-none"
          rows="4"
          placeholder="Enter text in English..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          onClick={handleMoveText}
          className="right-3  top-3 bg-blue-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-600"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
};

export default TranslatorApp;
