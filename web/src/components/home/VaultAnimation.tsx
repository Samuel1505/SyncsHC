"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const COIN_POSITIONS = [
  { top: "4%", left: "50%" },
  { top: "27%", left: "91%" },
  { top: "73%", left: "91%" },
  { top: "96%", left: "50%" },
  { top: "73%", left: "9%" },
  { top: "27%", left: "9%" },
];

const COIN_SYMBOLS = ["₿", "S", "$", "₿", "S", "$"];

export default function VaultAnimation() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(247,147,26,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.2)",
        }}
      />

      {/* Outer dashed ring (slow clockwise) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: "1.5px dashed rgba(247,147,26,0.25)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Mid ring (counter-clockwise) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "10%",
          border: "1px solid rgba(247,147,26,0.12)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "22%",
          border: "1px solid rgba(247,147,26,0.2)",
          boxShadow: "0 0 20px rgba(247,147,26,0.08)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* Vault center */}
      <motion.div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: "42%",
          height: "42%",
          background: "linear-gradient(135deg, #1a2035 0%, #0b0f1a 100%)",
          border: "1.5px solid rgba(247,147,26,0.45)",
          boxShadow:
            "0 0 50px rgba(247,147,26,0.2), inset 0 0 30px rgba(247,147,26,0.06)",
        }}
        animate={{ boxShadow: ["0 0 40px rgba(247,147,26,0.15)", "0 0 70px rgba(247,147,26,0.3)", "0 0 40px rgba(247,147,26,0.15)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck
          className="text-accent"
          style={{
            width: "45%",
            height: "45%",
            filter: "drop-shadow(0 0 10px rgba(247,147,26,0.7))",
          }}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Orbiting coins */}
      {COIN_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
            background: "rgba(247,147,26,0.85)",
            boxShadow: "0 0 14px rgba(247,147,26,0.5)",
            fontSize: "11px",
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.75, 1, 0.75],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 2.4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {COIN_SYMBOLS[i]}
        </motion.div>
      ))}
    </div>
  );
}
