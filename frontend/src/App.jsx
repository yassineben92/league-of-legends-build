import React, { useState, useEffect } from 'react';
import ChampionSelector from './components/ChampionSelector';
import BuildDisplay from './components/BuildDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [buildData, setBuildData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patch, setPatch] = useState('');

  useEffect(() => {
    fetchChampions();
    fetchPatch();
  }, []);

  const fetchPatch = async () => {
    try {
        const res = await fetch(`${API_BASE}/health`);
        const data = await res.json();
        setPatch(data.patch);
    } catch (err) {
        console.error("Failed to fetch patch info", err);
    }
  };

  const fetchChampions = async () => {
    try {
      const res = await fetch(`${API_BASE}/champions`);
      if (!res.ok) throw new Error('Failed to fetch champions');
      const data = await res.json();
      setChampions(data);
    } catch (err) {
      setError("Could not load champions. Is the backend running?");
    }
  };

  const handleSelectChampion = async (champion) => {
    setSelectedChampion(champion);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            champion_id: champion.id,
            // In a real app, user would input this via a modal or settings
            api_key: ''
        })
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setBuildData(data);
    } catch (err) {
      setError("AI Analysis Failed. Please try again.");
      setSelectedChampion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBuildData(null);
    setSelectedChampion(null);
  };

  return (
    <div className="min-h-screen bg-[#091428] text-[#C8AA6E] font-sans selection:bg-hextech-blue selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/magic-background.jpg')] bg-cover bg-center" />

      <div className="relative z-10">
        <header className="p-6 flex justify-between items-center border-b border-[#C8AA6E]/20 bg-[#091428]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0AC8B9] to-[#091428] border border-[#C8AA6E] flex items-center justify-center font-bold text-white">
                G3
             </div>
             <div>
                <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#C8AA6E] to-[#F0E6D2]">
                    GEMINI BUILDER
                </h1>
                <p className="text-xs text-[#0AC8B9] tracking-widest uppercase">Powered by Gemini 3 Pro Preview</p>
             </div>
          </div>
          <div className="text-sm text-[#C8AA6E]/60 font-mono">
            PATCH {patch || '...'}
          </div>
        </header>

        <main className="container mx-auto py-10 px-4">
          <AnimatePresence mode="wait">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6 text-center"
                >
                    {error}
                </motion.div>
            )}

            {loading && <LoadingOverlay key="loading" />}

            {!buildData && !loading && (
              <motion.div
                key="selector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold mb-4 text-white">Choose Your Champion</h2>
                    <p className="text-[#C8AA6E]/80">Select a champion to generate the perfect build using advanced AI reasoning.</p>
                 </div>
                 <ChampionSelector champions={champions} onSelect={handleSelectChampion} />
              </motion.div>
            )}

            {buildData && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BuildDisplay build={buildData} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
