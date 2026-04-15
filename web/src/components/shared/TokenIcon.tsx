import { Token } from "@/types";

interface TokenIconProps {
  token: Token;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

const symbolMap: Record<string, string> = {
  STX: "STX",
  sBTC: "₿",
  ALEX: "A",
  USDA: "$",
  xBTC: "₿",
};

export default function TokenIcon({ token, size = "md" }: TokenIconProps) {
  const label = symbolMap[token.symbol] || token.symbol.slice(0, 3);
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{
        background: `${token.color}22`,
        border: `1.5px solid ${token.color}55`,
        color: token.color,
      }}
    >
      {label}
    </div>
  );
}
