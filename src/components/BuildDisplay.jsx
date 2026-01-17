import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, BookOpen } from 'lucide-react';

const ItemCard = ({ name }) => (
  <div className="flex flex-col items-center p-2 bg-slate-800 border border-hextech-gold/30 rounded hover:border-hextech-blue transition-colors">
    <div className="w-12 h-12 bg-slate-700 flex items-center justify-center text-xs text-center mb-1 overflow-hidden">
        {/* In a real app we would map item names to images */}
        <span className="text-xs">{name}</span>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-900/50 border border-hextech-gold/20 p-6 rounded-lg backdrop-blur-md"
  >
    <div className="flex items-center gap-2 mb-4 border-b border-hextech-gold/20 pb-2">
      <Icon className="text-hextech-blue" />
      <h3 className="text-xl font-bold text-hextech-gold uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const BuildDisplay = ({ build, onReset }) => {
  if (!build) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 pb-20">
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        className="mb-4 text-hextech-blue hover:text-white underline"
      >
        &larr; Select Another Champion
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-hextech-gold to-hextech-blue mb-2">
          {build.champion_name}
        </h1>
        <div className="inline-block px-4 py-1 border border-hextech-blue rounded-full text-hextech-blue uppercase tracking-widest text-sm mb-4">
          {build.role}
        </div>
        <p className="max-w-2xl mx-auto text-slate-300 italic text-lg">
          "{build.summary}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items */}
        <Section title="Item Build" icon={Sword} delay={0.2}>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm text-slate-400 mb-2 uppercase">Starting Items</h4>
                    <div className="flex flex-wrap gap-2">
                        {build.starting_items.map((item, i) => <ItemCard key={i} name={item} />)}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm text-hextech-blue mb-2 uppercase font-bold">Core Build</h4>
                    <div className="flex flex-wrap gap-2">
                        {build.core_items.map((item, i) => <ItemCard key={i} name={item} />)}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm text-slate-400 mb-2 uppercase">Full Build</h4>
                    <div className="flex flex-wrap gap-2">
                        {build.full_build_order.map((item, i) => <ItemCard key={i} name={item} />)}
                    </div>
                </div>
            </div>
        </Section>

        {/* Runes */}
        <Section title="Runes & Stats" icon={Zap} delay={0.3}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-hextech-gold font-bold mb-2">{build.primary_rune_tree}</h4>
                    <div className="space-y-2">
                        <div className="text-hextech-blue font-bold border-l-2 border-hextech-blue pl-2">{build.keystone_rune}</div>
                        {build.primary_runes.map((r, i) => (
                            <div key={i} className="text-slate-300 text-sm pl-2">{r}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-hextech-gold font-bold mb-2">{build.secondary_rune_tree}</h4>
                    <div className="space-y-2">
                         {build.secondary_runes.map((r, i) => (
                            <div key={i} className="text-slate-300 text-sm pl-2">{r}</div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <h5 className="text-xs text-slate-500 uppercase">Shards</h5>
                        <div className="flex flex-wrap gap-2 mt-1">
                             {build.stat_shards.map((r, i) => (
                                <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{r}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <Section title="Skill Order" icon={BookOpen} delay={0.4}>
            <div className="flex flex-wrap gap-1">
                {build.skill_order.map((skill, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded font-bold ${
                            skill === 'R' ? 'bg-hextech-gold text-black' :
                            skill === 'Q' ? 'bg-blue-900 text-white' :
                            skill === 'W' ? 'bg-green-900 text-white' : 'bg-red-900 text-white'
                        }`}>
                            {skill}
                        </div>
                        <span className="text-[10px] text-slate-500">{i+1}</span>
                    </div>
                ))}
            </div>
        </Section>

        {/* Tips */}
        <Section title="Gemini Analysis" icon={Shield} delay={0.5}>
            <ul className="space-y-3">
                {build.gameplay_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-hextech-blue mt-1">•</span>
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </Section>
      </div>
    </div>
  );
};

export default BuildDisplay;
