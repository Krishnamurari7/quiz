'use client';

import { useParams, useRouter } from "next/navigation";
import dummySections from "@/data/dummySection.json";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function QuizDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  // Find quiz by matching slug (title)
  let quiz = null;
  outer: for (const section of dummySections) {
    for (const q of section.quizzes) {
      if (q.title === slug) {
        quiz = q;
        break outer;
      }
    }
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Quiz not found!</h2>
          <button 
            onClick={() => router.push('/')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const startQuiz = () => {
    router.push(`/quiz/countdown/${encodeURIComponent(quiz.title)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className="relative h-64 md:h-80">
            <Image
              src={quiz.img || "/quiz-placeholder.jpg"}
        alt={quiz.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{quiz.title}</h1>
              <div className="flex gap-4 text-sm">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  {quiz.questions} Questions
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  {quiz.plays} Plays
        </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {quiz.difficulty || 'Medium'}
        </span>
      </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Quiz Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">About this Quiz</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Test your knowledge with this exciting quiz! Each question is carefully crafted
                    to challenge your understanding and help you learn something new.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Features</h2>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">⏱️</span> 5 seconds per question
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">🎯</span> Single select questions
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">🏆</span> Score tracking
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="mr-2">📊</span> Detailed review after completion
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Leaderboard Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Performers</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        {rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">Player {rank}</div>
                        <div className="text-sm text-gray-500">{Math.floor(Math.random() * 100)}% Score</div>
                      </div>
                      <div className="text-yellow-500 font-bold">🏆</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Gallery */}
            {quiz.quizQuestions && quiz.quizQuestions.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions Preview</h2>
                <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-300">
                  {quiz.quizQuestions.map((q, idx) => (
                    <div key={idx} className="min-w-[260px] bg-gray-100 rounded-xl shadow p-4 flex flex-col items-center">
                      <img src={(q as any).image || quiz.img || '/quiz-placeholder.jpg'} alt={q.question} className="w-40 h-40 object-cover rounded mb-3" />
                      <div className="text-gray-800 font-semibold text-center mb-2">Q{idx + 1}.</div>
                      <div className="text-gray-700 text-center">{q.question}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={startQuiz}
                className="flex-1 bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                Start Quiz
              </button>
      <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
      >
                Back to Home
      </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
