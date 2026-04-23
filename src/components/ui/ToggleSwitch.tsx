import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isFormal: boolean;
  onToggle: (val: boolean) => void;
}

export function ToggleSwitch({ isFormal, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-center space-x-4 my-6">
      <span className={`text-sm font-medium ${!isFormal ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
        Informal
      </span>
      <button
        onClick={() => onToggle(!isFormal)}
        className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-pressed={isFormal}
      >
        <span className="sr-only">Toggle formality</span>
        <motion.span
          className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          animate={{ x: isFormal ? 36 : 4 }}
        />
      </button>
      <span className={`text-sm font-medium ${isFormal ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
        Formal
      </span>
    </div>
  );
}
