"use client";

export default function LogoBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-10 h-10 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-32 h-32 border-4"
  };

  const textSizes = {
    sm: { top: "text-[6px]", mid: "text-[10px]", bot: "text-[8px]" },
    md: { top: "text-[8px]", mid: "text-lg", bot: "text-xs" },
    lg: { top: "text-xs", mid: "text-2xl", bot: "text-lg" }
  };

  return (
    <div className={`${sizes[size]} bg-secondary rounded-full flex items-center justify-center border-white shadow-lg shrink-0`}>
      <div className="text-center leading-tight">
        <p className={`${textSizes[size].top} font-bold text-black uppercase`}>Original</p>
        <p className={`${textSizes[size].mid} font-black text-black`}>REG</p>
        <p className={`${textSizes[size].bot} font-bold text-black`}>37397</p>
      </div>
    </div>
  );
}
