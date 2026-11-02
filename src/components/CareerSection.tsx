import React from 'react';
import { motion } from 'motion/react';
import { careers } from '../data/careersData';

interface CareerSectionProps {
  onSelectCareer: (career: typeof careers[0]) => void;
}

export default function CareerSection({ onSelectCareer }: CareerSectionProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {careers.map((career) => (
        <button
          key={career.id}
          onClick={() => onSelectCareer(career)}
          className="bg-[var(--card)] p-6 rounded-3xl shadow-lg border border-[var(--border)] hover:border-amber-200 transition-all text-right"
        >
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{career.title}</h3>
          <p className="text-[var(--muted)] text-sm">{career.description}</p>
        </button>
      ))}
    </motion.div>
  );
}
