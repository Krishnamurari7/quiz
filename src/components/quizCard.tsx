"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function QuizCard({ quiz }: { quiz: any }) {
  return (
    <Link href={`/quiz/${encodeURIComponent(quiz.title)}`} passHref>
      <motion.div
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 w-56 min-w-[220px] flex-shrink-0 flex flex-col cursor-pointer no-underline relative overflow-hidden group"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="h-32 w-full rounded-lg overflow-hidden mb-3 flex items-center justify-center bg-gray-100 relative"
          variants={imageVariants}
        >
          <Image
            src={quiz.img || "/quiz-placeholder.jpg"}
            alt={quiz.title}
            width={220}
            height={128}
            className="object-cover w-full h-full transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 text-gray-800 group-hover:text-purple-600 transition-colors">
            {quiz.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-auto">
            <motion.span 
              className="bg-purple-100 text-purple-700 rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <span role="img" aria-label="questions">📝</span>
              {quiz.questions} Qs
            </motion.span>
            <motion.span 
              className="bg-blue-100 text-blue-700 rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <span role="img" aria-label="plays">🎮</span>
              {quiz.plays} Plays
            </motion.span>
          </div>

          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            initial={false}
          />
        </div>
      </motion.div>
    </Link>
  );
}
