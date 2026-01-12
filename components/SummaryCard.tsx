
import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value }) => {
  return (
    <div>
      <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{value}</p>
      <p className="text-slate-400 text-base mt-1">{label}</p>
    </div>
  );
};