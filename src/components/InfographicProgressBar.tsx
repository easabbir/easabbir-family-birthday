import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  percentage: number;
  color: string;
  daysToNext: number;
}

export const InfographicProgressBar: React.FC<Props> = ({ percentage, color, daysToNext }) => {
  // Use state to delay percentage application for smooth load animation
  const [targetWidth, setTargetWidth] = useState(0);

  useEffect(() => {
    // slight delay for animation effect
    const timer = setTimeout(() => {
      setTargetWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Year Progress</span>
        <span className="text-sm font-mono font-bold" style={{ color }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-1 relative border border-slate-200 shadow-inner">
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${targetWidth}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Subtle shine effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-full"></div>
        </motion.div>
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        <span>Last BD</span>
        <span className="text-right">Next BD <span className="font-semibold text-slate-500 ml-0.5">({daysToNext}d left)</span></span>
      </div>
    </div>
  );
};
