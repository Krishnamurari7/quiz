// app/page.tsx
import React from "react";
import dummySections from "@/data/dummySection.json";
import QuizCard from "@/components/quizCard";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        {dummySections.map((section) => (
          <div key={section.title} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {section.title}
              </h2>
              <button className="text-sm font-medium text-purple-600 hover:underline transition-all">
                See All
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-300">
              {section.quizzes.map((quiz, idx) => (
                <QuizCard quiz={quiz} key={quiz.title + idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
