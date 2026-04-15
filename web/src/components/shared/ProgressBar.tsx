"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0–100
  showLabel?: boolean;
  color?: string;
}

export default function ProgressBar({
  progress,
  showLabel = false,
  color = "#f7931a",
}: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{
            background:
              progress >= 100
                ? "#10b981"
                : `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
