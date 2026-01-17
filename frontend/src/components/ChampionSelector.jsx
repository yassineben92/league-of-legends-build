import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const ChampionSelector = ({ champions, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChampions = champions.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-hextech-gold" />
        </div>
        <input
          type="text"
          placeholder="Search Champion..."
          className="w-full pl-10 p-3 bg-slate-900 border border-hextech-gold text-hextech-gold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hextech-blue rounded-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {filteredChampions.map((champ) => (
          <motion.div
            key={champ.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05, borderColor: '#0AC8B9' }}
            className="cursor-pointer group relative border border-transparent hover:border-hextech-blue transition-all duration-200"
            onClick={() => onSelect(champ)}
          >
            <img
              src={champ.image}
              alt={champ.name}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-center text-xs py-1 text-hextech-gold group-hover:text-hextech-blue">
              {champ.name}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ChampionSelector;
