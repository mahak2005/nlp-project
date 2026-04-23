import { diffWords } from 'diff';

interface DiffViewerProps {
  original: string;
  transformed: string;
}

export function DiffViewer({ original, transformed }: DiffViewerProps) {
  const diffs = diffWords(original, transformed);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[120px] whitespace-pre-wrap leading-relaxed shadow-inner">
      {diffs.map((part, index) => {
        const colorClass = part.added
          ? 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-300 font-medium px-1 rounded'
          : part.removed
          ? 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-300 line-through px-1 rounded mx-1 opacity-50'
          : 'text-gray-800 dark:text-gray-200';
          
        return (
          <span key={index} className={colorClass}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
}
