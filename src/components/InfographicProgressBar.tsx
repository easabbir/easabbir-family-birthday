import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  percentage: number;
  color: string;
  daysToNext: number;
}

export const InfographicProgressBar: React.FC<Props> = ({ percentage, color, daysToNext }) => {
  const [targetWidth, setTargetWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTargetWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2 relative border border-slate-200 dark:border-slate-700 shadow-inner">
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${targetWidth}%` }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }} // Bouncy ease
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent"></div>
          
          {/* Animated glow */}
          <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-sm animate-pulse"></div>
        </motion.div>
      </div>
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <span>Passed</span>
        <span className="text-right">
          <span className="text-orange-500 dark:text-orange-400">{daysToNext} Days</span> Remaining
        </span>
      </div>
    </div>
  );
};
