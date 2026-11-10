import React from 'react';
import { StudentProfile } from '../types';

export const Avatar: React.FC<{ s?: StudentProfile; size?: number; ring?: boolean }> = ({ s, size = 40, ring }) => {
  const initials = s?.name.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '?';
  return (
    <span className={`relative inline-grid place-items-center shrink-0 rounded-full overflow-hidden bg-royal-line text-white font-bold ${ring ? 'ring-[3px] ring-volt' : ''}`} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      <span aria-hidden>{initials}</span>
      {s?.avatar && <img src={s.avatar} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
    </span>
  );
};

/** five pips for a 1–5 skill level */
export const Pips: React.FC<{ level: number; need?: number; dark?: boolean }> = ({ level, need = 0, dark }) => (
  <span className="inline-flex gap-[3px]" aria-label={`level ${level} of 5${need ? `, needs ${need}` : ''}`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`w-2.5 h-2.5 rounded-[3px] ${
        i < level ? (dark ? 'bg-royal' : 'bg-volt')
        : i < need ? 'bg-miss/45'
        : dark ? 'bg-royal/12' : 'bg-white/15'}`} />
    ))}
  </span>
);

export const Head: React.FC<{ title: React.ReactNode; sub?: string; right?: React.ReactNode }> = ({ title, sub, right }) => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
    <div>
      <h1 className="disp font-black text-[34px] md:text-[52px] leading-[0.95]">{title}</h1>
      {sub && <p className="text-mist text-[17px] mt-3 max-w-[60ch]">{sub}</p>}
    </div>
    {right}
  </header>
);

export const scoreColor = (n: number) => (n >= 80 ? 'text-hit' : n >= 60 ? 'text-volt' : 'text-miss');
