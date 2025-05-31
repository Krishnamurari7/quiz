'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import leaderboardData from '@/data/leaderboard.json';
import Image from 'next/image';

interface LeaderboardEntry {
  name: string;
  score: number;
  quizTitle: string;
  timestamp: number;
  avatar?: string;
}

interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
}

export default function LeaderboardPage() {
  const [rankedLeaderboard, setRankedLeaderboard] = useState<RankedLeaderboardEntry[]>([]);
  const [top3, setTop3] = useState<RankedLeaderboardEntry[]>([]);
  const [rest, setRest] = useState<RankedLeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<RankedLeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  // Define the current user's name (can be dynamic in a real app)
  const currentUserName = "Alex Thompson"; // Using a name from dummy data

  useEffect(() => {
    setHasMounted(true);
    const loadLeaderboard = async () => {
      try {
        // Process and sort results from JSON data
        const sortedResults = [...leaderboardData.results].sort((a, b) => b.score - a.score);

        const ranked = sortedResults.map((result, index) => ({
          ...result,
          rank: index + 1,
        }));

        setRankedLeaderboard(ranked);

        // Separate top 3 and rest
        setTop3(ranked.slice(0, 3));
        setRest(ranked.slice(3));

        // Find current user entry
        const currentUser = ranked.find(entry => entry.name === currentUserName);
        setCurrentUserEntry(currentUser || null);

      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUserName]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!hasMounted || isLoading) {
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
    <div className="min-h-screen bg-[#18333a] pb-40">
      {/* Header */}
      <motion.div
        className="w-full max-w-6xl mx-auto px-4 pt-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              Leaderboard
            </motion.h1>
          </div>
          <motion.div
            className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-700 px-4 py-2 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          >
            Top Players
          </motion.div>
        </div>

        {/* Podium Section */}
        {top3.length > 0 && (
          <motion.div
            className="flex justify-center items-end gap-4 sm:gap-8 mt-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.5, damping: 15 }}
          >
            {/* 2nd Place */}
            {top3[1] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-blue-300 overflow-hidden mb-2 relative">
                  <Image src={top3[1].avatar || '/default-avatar.png'} alt={`${top3[1].name}'s avatar`} layout="fill" objectFit="cover" />
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">2</div>
                </div>
                <div className="text-white text-sm sm:text-lg font-semibold mb-1 text-center">{top3[1].name}</div>
                <div className="text-blue-300 font-bold text-lg sm:text-2xl flex items-center gap-1"><span className="text-base sm:text-xl">🪙</span>{top3[1].score}</div>
              </motion.div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <motion.div
                className="flex flex-col items-center relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl">👑</div>
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 relative">
                   <Image src={top3[0].avatar || '/default-avatar.png'} alt={`${top3[0].name}'s avatar`} layout="fill" objectFit="cover" />
                   <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-sm sm:text-base font-bold rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center">1</div>
                </div>
                <div className="text-white text-base sm:text-xl font-bold mb-1 text-center">{top3[0].name}</div>
                <div className="text-yellow-400 font-bold text-xl sm:text-3xl flex items-center gap-1"><span className="text-lg sm:text-2xl">🪙</span>{top3[0].score}</div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-green-300 overflow-hidden mb-2 relative">
                   <Image src={top3[2].avatar || '/default-avatar.png'} alt={`${top3[2].name}'s avatar`} layout="fill" objectFit="cover" />
                   <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">3</div>
                </div>
                <div className="text-white text-sm sm:text-lg font-semibold mb-1 text-center">{top3[2].name}</div>
                <div className="text-green-300 font-bold text-lg sm:text-2xl flex items-center gap-1"><span className="text-base sm:text-xl">🪙</span>{top3[2].score}</div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Rest of leaderboard */}
        {rest.length > 0 && (
          <motion.div
            className="bg-[#1a3a42] rounded-2xl shadow-2xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-[#18333a] text-yellow-400 font-semibold text-sm sm:text-base">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-2 text-center">Avatar</div>
              <div className="col-span-3">Player</div>
              <div className="col-span-3">Quiz</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-1 text-center">Date</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#18333a]">
              {rest.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#1f424a] transition-colors"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 100,
                    delay: 0.1 * index,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.01, backgroundColor: '#1f424a' }}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-[#18333a] text-gray-400`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {entry.rank}
                    </motion.div>
                  </div>

                  {/* Avatar */}
                  <div className="col-span-2 flex justify-center">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative"
                      whileHover={{ scale: 1.1 }}
                    >
                       <Image src={entry.avatar || '/default-avatar.png'} alt={`${entry.name}'s avatar`} layout="fill" objectFit="cover" />
                    </motion.div>
                  </div>

                  {/* Player Name */}
                  <div className="col-span-3 text-white font-medium truncate">
                    {entry.name}
                  </div>

                  {/* Quiz Title */}
                  <div className="col-span-3 text-gray-300 truncate">
                    {entry.quizTitle}
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <motion.div
                      className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 rounded-full font-bold text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {entry.score}
                    </motion.div>
                  </div>

                  {/* Date */}
                  <div className="col-span-1 text-center text-xs text-gray-400">
                    {formatDate(entry.timestamp)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {rankedLeaderboard.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl text-yellow-400 font-bold mb-2">No Scores Yet</h2>
            <p className="text-gray-400">Be the first to take a quiz and appear on the leaderboard!</p>
            <motion.button
              className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-6 py-3 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
            >
              Take a Quiz
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Current User Bar */}
      {currentUserEntry && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-teal-600 to-teal-800 p-4 sm:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.9 }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
            {/* Rank */}
            <motion.div
              className="text-white font-bold text-lg sm:text-xl w-8 sm:w-10 flex-shrink-0 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
            >
              {currentUserEntry.rank}
            </motion.div>

            {/* Avatar */}
            <motion.div
               className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400 overflow-hidden flex-shrink-0 relative"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 1.1 }}
            >
              <Image src={currentUserEntry.avatar || '/default-avatar.png'} alt={`${currentUserEntry.name}'s avatar`} layout="fill" objectFit="cover" />
            </motion.div>

            {/* Name and Quiz */}
            <div className="flex-1 flex flex-col truncate">
               <motion.span 
                 className="text-white font-semibold text-base sm:text-lg truncate"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 1.2 }}
                >
                    {currentUserEntry.name}
                </motion.span>
                <motion.span 
                  className="text-gray-300 text-xs sm:text-sm truncate"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 1.3 }}
                >
                    {currentUserEntry.quizTitle}
                </motion.span>
            </div>

            {/* Score */}
            <motion.div
              className="text-yellow-300 font-bold text-lg sm:text-xl flex items-center gap-1 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <span className="text-base sm:text-xl">🪙</span>
              {currentUserEntry.score}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
