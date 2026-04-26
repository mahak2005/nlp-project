'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Copy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { ScoreIndicator } from '@/components/ui/ScoreIndicator';
import { DiffViewer } from '@/components/ui/DiffViewer';
import { cn } from '@/lib/utils';

interface TransformationResult {
  original: string;
  transformed: string;
  explanation: string;
  scores: {
    formality: number;
    similarity: number;
    fluency: number;
  };
}

export default function Home() {
  const [text, setText] = useState('');
  const [isFormal, setIsFormal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTransform = async () => {
    if (!text.trim()) {
      setError('Please enter some text to transform.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          mode: isFormal ? 'informal-to-formal' : 'formal-to-informal',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform text');
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while processing your request. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.transformed) {
      navigator.clipboard.writeText(result.transformed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 font-sans flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-2"
          >
            <ArrowRightLeft className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Text Style Transfer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Seamlessly rewrite your text. Convert informal slang to professional language, or loosen up stiff writing with our advanced NLP models.
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="p-6 md:p-8 space-y-6">
            
            <ToggleSwitch isFormal={isFormal} onToggle={setIsFormal} />

            <div className="space-y-3">
              <label htmlFor="text-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Input Text
              </label>
              <textarea
                id="text-input"
                rows={5}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none shadow-sm"
                placeholder={isFormal ? "Enter informal text here (e.g., 'hey guys gonna grab a bite cuz I'm starving')..." : "Enter formal text here (e.g., 'Greetings individuals, I am going to procure some nourishment because I am famished')..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 dark:border-red-900/30"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleTransform}
              disabled={isLoading || !text.trim()}
              className={cn(
                "w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2",
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                `Convert to ${isFormal ? 'Formal' : 'Informal'}`
              )}
            </button>

          </div>

          {/* Results Section */}
          <AnimatePresence>
            {result && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, borderTopWidth: 0 }} 
                animate={{ opacity: 1, borderTopWidth: 1 }} 
                exit={{ opacity: 0 }}
                className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 p-6 md:p-8"
              >
                <div className="space-y-8">
                  
                  {/* Output Text */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Transformed Output
                      </h3>
                      <button 
                        onClick={handleCopy}
                        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    
                    <DiffViewer original={result.original} transformed={result.transformed} />
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      Legend: <span className="bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-300 line-through px-1 rounded mx-1">Removed</span> | <span className="bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-300 px-1 rounded mx-1">Added</span>
                    </p>

                    <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Conversion Explanation
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Scores */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Analysis Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ScoreIndicator 
                        label="Formality" 
                        score={result.scores.formality} 
                        color={result.scores.formality > 0.8 ? "bg-green-500" : result.scores.formality < 0.4 ? "bg-red-500" : "bg-yellow-500"} 
                      />
                      <ScoreIndicator 
                        label="Semantic Similarity" 
                        score={result.scores.similarity} 
                        color="bg-blue-500" 
                      />
                      <ScoreIndicator 
                        label="Fluency" 
                        score={result.scores.fluency} 
                        color="bg-purple-500" 
                      />
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
