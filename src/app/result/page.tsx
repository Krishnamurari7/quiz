'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  image?: string;
}

interface QuizResult {
  score: number;
  answers: string[];
  timeSpent: number;
  quizTitle: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  timestamp: number;
}

export default function ResultPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    accuracy: 0,
    avgTimePerQuestion: 0
  });
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const res = localStorage.getItem('quizResult');
    if (res) {
      const parsed = JSON.parse(res) as QuizResult;
      setResult(parsed);

      let correct = 0, incorrect = 0, unattempted = 0;
      parsed.questions?.forEach((q, idx) => {
        const ans = parsed.answers?.[idx];
        if (!ans || ans === '') unattempted++;
        else if (ans === q.answer) correct++;
        else incorrect++;
      });

      const accuracy = parsed.totalQuestions ? Math.round((correct / parsed.totalQuestions) * 100) : 0;
      const avgTimePerQuestion = parsed.totalQuestions ? Math.round(parsed.timeSpent / parsed.totalQuestions) : 0;

      setStats({
        correct,
        incorrect,
        unattempted,
        accuracy,
        avgTimePerQuestion
      });
    } else {
      router.push('/');
    }
  }, [router]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!hasMounted || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18333a]">
        <motion.div
          className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#18333a] pb-40 w-full">
      {/* Header Section */}
      <motion.div
        className="w-full max-w-6xl px-4 pt-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <motion.button
              onClick={() => router.back()}
              className="text-yellow-400 text-3xl font-bold hover:text-yellow-300 transition-colors p-2"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              &#8592;
            </motion.button>
            <motion.h1
              className="text-yellow-400 text-2xl sm:text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            >
              {result.quizTitle}
            </motion.h1>
          </div>
          <motion.div
            className="text-lg sm:text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          >
            Score: {result.score}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#1a3a42] p-4 sm:p-6 rounded-2xl shadow-2xl mb-8 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
        >
          {[
            { label: 'Correct Answers', value: stats.correct, icon: '✅', color: 'from-green-500 to-green-700' },
            { label: 'Incorrect Answers', value: stats.incorrect, icon: '❌', color: 'from-red-500 to-red-700' },
            { label: 'Unattempted', value: stats.unattempted, icon: '⚪', color: 'from-gray-500 to-gray-700' },
            { label: 'Accuracy', value: `${stats.accuracy}%`, icon: '🎯', color: 'from-blue-500 to-blue-700' },
            { label: 'Time Spent', value: formatTime(result.timeSpent), icon: '⏱️', color: 'from-indigo-500 to-indigo-700' },
            { label: 'Avg Time/Question', value: formatTime(stats.avgTimePerQuestion), icon: '⚡', color: 'from-pink-500 to-pink-700' },
            { label: 'Total Questions', value: result.totalQuestions, icon: '📝', color: 'from-purple-500 to-purple-700' },
            { label: 'Coins Earned', value: result.score, icon: '🪙', color: 'from-yellow-500 to-yellow-700' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-3 sm:p-4 shadow-lg w-full`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                delay: 0.1 * index,
                damping: 15
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.span
                    className="text-xl sm:text-2xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 * index }}
                  >
                    {stat.icon}
                  </motion.span>
                  <span className="font-medium text-sm sm:text-base">{stat.label}</span>
                </div>
                <motion.div
                  className="text-lg sm:text-xl font-bold"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 * index }}
                >
                  {stat.value}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#18333a] to-[#1a3a42] p-4 sm:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const shareText = `I scored ${result.score} points in ${result.quizTitle} with ${stats.accuracy}% accuracy! Can you beat my score?`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Quiz Result',
                    text: shareText,
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert('Result copied to clipboard!');
                }
              }}
            >
              <span className="text-lg sm:text-xl">📤</span>
              Share Score
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/review')}
            >
              <span className="text-lg sm:text-xl">📝</span>
              Review Questions
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-green-600 to-green-800 text-white w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/leaderboard')}
            >
              <span className="text-lg sm:text-xl">🏆</span>
              View Leaderboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
