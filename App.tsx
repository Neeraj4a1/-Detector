import React, { useState, useEffect } from 'react';
import { SearchIcon, LoaderIcon } from './components/Icons';
import { checkFact } from './services/geminiService';
import { AnalysisResult } from './types';
import ResultCard from './components/ResultCard';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Focus input on mount
  useEffect(() => {
    const input = document.getElementById('fact-input');
    if (input) input.focus();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await checkFact(query);
      setResult(data);
    } catch (err) {
      setError("Failed to verify the claim. Please check your internet connection or try a different query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <SearchIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Veritas AI
            </h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Verify rumors, news, and claims instantly using advanced AI grounding and real-time search.
          </p>
        </header>

        {/* Input Section */}
        <div className={`w-full max-w-3xl transition-all duration-500 ease-in-out ${result ? 'mb-8' : 'mb-32'}`}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-stretch bg-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <textarea
                id="fact-input"
                className="w-full bg-transparent text-white placeholder-slate-500 px-6 py-5 text-lg md:text-xl focus:outline-none resize-none min-h-[80px]"
                placeholder="Paste a rumor, news headline, or claim here..."
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 md:px-8 bg-slate-800 hover:bg-slate-700 border-l border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoaderIcon className="w-6 h-6 animate-spin text-blue-400" />
                ) : (
                  <SearchIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>
          
          {/* Example Prompts - Only show when no result */}
          {!result && !loading && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-slate-500 text-sm py-1">Try asking:</span>
              <button 
                onClick={() => setQuery("Drinking 8 glasses of water a day is mandatory for health.")}
                className="text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                "8 glasses of water rule?"
              </button>
              <button 
                onClick={() => setQuery("Did humans actually land on the moon in 1969?")}
                className="text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                "Moon landing 1969"
              </button>
              <button 
                onClick={() => setQuery("The Great Wall of China is visible from space.")}
                className="text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                "Great Wall from space"
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full max-w-4xl text-center py-20 animate-pulse">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-400 text-lg">Cross-referencing global sources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <ResultCard result={result} />
        )}
      </div>
    </div>
  );
}

export default App;