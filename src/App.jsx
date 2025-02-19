// import LanguageDetection from "./components/LanguageDetection";
// import Translator from "./components/Translator";

// function App() {
//   return (
//     <div>
//       <Translator />;
//       <LanguageDetection />
//     </div>
//   );
// }

// export default App;

import { TranslatorProvider } from "./context/TranslatorContext";
import TranslatorApp from "./components/TranslatorApp";

function App() {
  return (
    <TranslatorProvider>
      <TranslatorApp />
    </TranslatorProvider>
  );
}

export default App;
