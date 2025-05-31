'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.3
    } 
  },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export default function CountdownPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      // Navigate to the quiz play page after countdown
      router.push(`/quiz/play/${encodeURIComponent(slug)}`);
      return;
    }

    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, slug, router]);

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-[#18333a] p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="flex flex-col items-center justify-center text-center"
        variants={itemVariants}
      >
        <motion.h2
          key="countdown-heading"
          variants={itemVariants}
          className="text-white text-3xl sm:text-4xl font-bold mb-6"
        >
          Quiz Starts in
        </motion.h2>
        {countdown > 0 ? (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 10 }}
            className="text-green-400 text-8xl sm:text-9xl font-bold"
          >
            {countdown}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.6 }}
            className="text-green-400 text-7xl sm:text-8xl font-bold"
          >
            Go!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 