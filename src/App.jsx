import { useState, useEffect } from "react";

function TranslatorApp() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("A tradução aparecerá aqui");
  const [sourceLang, setSourceLang] = useState("pt-br");
  const [targetLang, setTargetLang] = useState("en-us");
  const [loading, setLoading] = useState(false);
  const [translationError, setTranslationError] = useState("");

  const languages = [
    { code: "en-us", label: "Inglês" },
    { code: "es", label: "Espanhol" },
    { code: "fr", label: "Francês" },
    { code: "de", label: "Alemão" },
    { code: "it", label: "Italiano" },
    { code: "pt-br", label: "Português" },
  ];

  const fetchTranslation = async (text) => {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`
    );
    const result = await response.json();
    return result.responseData.translatedText;
  };

  useEffect(() => {
    if (inputText.trim()) {
      performTranslation();
    } else {
      setTranslatedText("A tradução aparecerá aqui");
    }
  }, [inputText, sourceLang, targetLang]);

  const performTranslation = async () => {
    if (!inputText.trim()) {
      setTranslatedText("A tradução aparecerá aqui");
      return;
    }

    setLoading(true);
    setTranslationError("");

    try {
      const result = await fetchTranslation(inputText);
      setTranslatedText(result);
    } catch (err) {
      console.error("Erro ao buscar tradução:", err);
      setTranslationError("Falha ao traduzir. Por favor, tente novamente.");
      setTranslatedText("Falha ao traduzir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const switchLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">Aplicativo de Tradução</h1>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              className="text-sm text-textColor bg-transparent border-none focus:outline-none"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            <button
              onClick={switchLanguages}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select
              className="text-sm text-textColor bg-transparent border-none focus:outline-none"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                className="w-full h-40 text-lg text-textColor bg-transparent border-none outline-none"
                placeholder="Insira o texto..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
            </div>

            <div className="relative p-4 bg-secondaryBackground border-l border-gray-200">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-blue-500 border-t-2"></div>
                </div>
              ) : (
                <p className="text-lg text-textColor">{translatedText}</p>
              )}
            </div>
          </div>

          {translationError && (
            <div className="p-4 bg-red-100 border-t border-red-400 text-red-700">
              {translationError}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor">
          &copy; {new Date().getFullYear()} Aplicativo de Tradução
        </div>
      </footer>
    </div>
  );
}

export default TranslatorApp;

