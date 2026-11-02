import React from 'react';
import { motion } from 'motion/react';
import { masterPrograms } from '../data/careersData';

interface MasterSectionProps {
  onSelectMaster: (master: typeof masterPrograms[0]) => void;
}

export default function MasterSection({ onSelectMaster }: MasterSectionProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {masterPrograms.map((master) => (
        <button
          key={master.id}
          onClick={() => onSelectMaster(master)}
          className="bg-[var(--card)] p-6 rounded-3xl shadow-lg border border-[var(--border)] hover:border-amber-200 transition-all text-right"
        >
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{master.title}</h3>
          <p className="text-[var(--muted)] text-sm">{master.description}</p>
        </button>
      ))}
    </motion.div>
  );
}
