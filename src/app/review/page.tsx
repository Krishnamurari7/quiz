'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const optionLabels = ['A', 'B', 'C', 'D'];

export default function ReviewPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const res = localStorage.getItem('quizResult');
    if (res) {
      setQuizResult(JSON.parse(res) as QuizResult);
    } else {
      router.push('/'); // Redirect to home if no result found
    }
  }, [router]);

  if (!quizResult) return (
    <div className="min-h-screen flex items-center justify-center bg-[#18333a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
    </div>
  );

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const avgTimePerQuestion = Math.round(quizResult.timeSpent / quizResult.totalQuestions);

  return (
    <div className="min-h-screen bg-[#18333a] pb-10">
      <div className="max-w-7xl mx-auto pt-4 sm:pt-8 px-3 sm:px-4">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <button 
            onClick={() => router.back()} 
            className="text-yellow-400 text-2xl sm:text-3xl font-bold hover:text-yellow-300 transition-colors"
          >
            &#8592;
          </button>
          <span className="text-yellow-400 text-xl sm:text-2xl md:text-3xl font-bold truncate">{quizResult.quizTitle} - Review</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {quizResult.questions.map((q, idx) => {
            const userAns = quizResult.answers[idx];
            const isCorrect = userAns === q.answer;
            const isUnattempted = !userAns || userAns === '';
            
            return (
              <div 
                key={idx} 
                className="bg-[#223e47] rounded-xl shadow-lg p-4 sm:p-6 border border-[#2c4a56] hover:border-[#3a5d6a] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <span className="text-white font-bold text-base sm:text-lg">Question {idx + 1}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className={`rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold ${
                        isUnattempted 
                          ? 'bg-gray-600 text-white' 
                          : isCorrect 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                      }`}
                    >
                      {isUnattempted ? '?' : isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#101c22] text-white px-2 py-1 rounded text-xs font-semibold border border-[#2c4a56] whitespace-nowrap">
                        Single Select
                      </span>
                      <span className="bg-[#101c22] text-white px-2 py-1 rounded text-xs font-semibold border border-[#2c4a56] flex items-center gap-1 whitespace-nowrap">
                        <span role="img" aria-label="timer">⏱️</span> {formatTime(avgTimePerQuestion)}
                      </span>
                      <span className="bg-[#101c22] text-yellow-400 px-2 py-1 rounded text-xs font-semibold border border-[#2c4a56] flex items-center gap-1 whitespace-nowrap">
                        <span role="img" aria-label="coin">🪙</span> {isCorrect ? '4' : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {q.image && (
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <img 
                      src={q.image} 
                      alt="Question" 
                      className="rounded-lg max-h-32 sm:max-h-40 md:max-h-48 w-auto object-contain border-2 border-[#2c4a56]" 
                    />
                  </div>
                )}

                <div className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{q.question}</div>
                
                <div className="space-y-2">
                  {q.options.map((opt, oidx) => {
                    const isUserAnswer = userAns === opt;
                    const isCorrectAnswer = q.answer === opt;
                    const isUnattemptedAnswer = isUnattempted && isCorrectAnswer;
                    
                    let optionStyle = 'border-[#3a4a56] bg-transparent text-white';
                    let label = '';
                    
                    if (isCorrectAnswer) {
                      optionStyle = 'border-green-500 bg-[#18333a] text-green-400 font-semibold';
                      label = 'Correct Answer';
                    }
                    if (isUserAnswer && !isCorrectAnswer) {
                      optionStyle = 'border-red-500 bg-[#18333a] text-red-400 font-semibold';
                      label = 'Your Answer';
                    }
                    if (isUnattemptedAnswer) {
                      optionStyle = 'border-yellow-500 bg-[#18333a] text-yellow-400 font-semibold';
                      label = 'Correct Answer (Unattempted)';
                    }

                    return (
                      <div 
                        key={opt} 
                        className={`flex items-center border rounded-lg px-3 sm:px-4 py-2 sm:py-3 relative ${optionStyle} transition-colors`}
                      >
                        <span 
                          className={`mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                            isCorrectAnswer 
                              ? 'bg-green-600 text-white' 
                              : isUserAnswer && !isCorrectAnswer 
                                ? 'bg-red-600 text-white'
                                : isUnattemptedAnswer
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-[#101c22] text-white'
                          }`}
                        >
                          {optionLabels[oidx]}
                        </span>
                        <span className="flex-1 text-sm sm:text-base pr-16 sm:pr-20">{opt}</span>
                        {label && (
                          <span className="absolute right-2 sm:right-4 text-[10px] sm:text-xs font-medium">{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}