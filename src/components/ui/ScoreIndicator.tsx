import { motion } from "framer-motion";

interface ScoreIndicatorProps {
  label: string;
  score: number; // 0.0 to 1.0
  color?: string;
}

export function ScoreIndicator({ label, score, color = "bg-blue-500" }: ScoreIndicatorProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-900 dark:text-white">{(score * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
