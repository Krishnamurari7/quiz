'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dummySections from "@/data/dummySection.json";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';


interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  image?: string;
}

const questionCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
  exit: { opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.3 } },
};

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [waitingNext, setWaitingNext] = useState(false);
  const [coinPosition, setCoinPosition] = useState<{ x: number; y: number } | null>(null);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [startTime] = useState(Date.now());
  const [quizTitle, setQuizTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTime, setQuestionTime] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
  audioRef.current = new Audio('/background-music.mp3');
  audioRef.current.loop = true;

  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, []);

const toggleMusic = () => {
  if (!audioRef.current) return;

  if (isMusicPlaying) {
    audioRef.current.pause();
    alert('Background music turned off');
  } else {
    audioRef.current.play().catch(err => console.log('Play error:', err));
    alert('Background music turned on');
  }
  setIsMusicPlaying(!isMusicPlaying);
};

  

  const autoNextTimeout = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const questionTimerInterval = useRef<NodeJS.Timeout | null>(null);

  const QUESTION_DURATION = 60;

  useEffect(() => {
    setIsLoading(true);
    let foundQuiz = null;
    outer: for (const section of dummySections) {
      for (const q of section.quizzes) {
        if (q.title === slug) {
          foundQuiz = q;
          break outer;
        }
      }
    }

    if (!foundQuiz) {
      router.push('/');
      return;
    }

    setQuizTitle(foundQuiz.title);
    const questions = foundQuiz.quizQuestions?.map((q: any) => ({
      ...q,
      image: q.image || foundQuiz.img || "/quiz-placeholder.jpg"
    })) || [{
      question: "Sample question for " + foundQuiz.title,
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      answer: "Option 1",
      image: foundQuiz.img || "/quiz-placeholder.jpg"
    }];
    setQuizData(questions);
    setIsLoading(false);
  }, [slug, router]);

  useEffect(() => {
    if (!isLoading && current < quizData.length) {
      questionTimerInterval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
        setQuestionTime(elapsed);

        if (elapsed >= QUESTION_DURATION) {
          clearInterval(questionTimerInterval.current!);
          goToNextQuestion();
        }
      }, 1000);
    }
    return () => clearInterval(questionTimerInterval.current!);
  }, [isLoading, current, quizData.length, questionStartTime]);


  const goToNextQuestion = () => {
    const correct = quizData[current].answer === (selected || '');
    if (correct) {
      setScore(prev => prev + 4);
      triggerCoinAnimation();
    }
    setAnswers(prev => [...prev, selected || '']);
    setSelected(null);
    setWaitingNext(false);
    setCurrent(prev => prev + 1);
    setQuestionStartTime(Date.now());
    setQuestionTime(0);
  };

  const startAutoNextTimer = () => {
    setWaitingNext(true);
    clearTimeout(autoNextTimeout.current!);
    autoNextTimeout.current = setTimeout(() => {
      current < quizData.length - 1 ? goToNextQuestion() : handleSubmit();
    }, 5000);
  };

  const handleSelect = (option: string, e: React.MouseEvent) => {
    if (selected) return;
    setSelected(option);
    clearInterval(questionTimerInterval.current!);

    const optionRect = (e.target as HTMLElement).getBoundingClientRect();
    const scoreRect = scoreRef.current?.getBoundingClientRect();

    if (scoreRect) {
      const startX = optionRect.left + optionRect.width / 2;
      const startY = optionRect.top + optionRect.height / 2;
      const endX = scoreRect.left + scoreRect.width / 2;
      const endY = scoreRect.top + scoreRect.height / 2;
      setCoinPosition({ x: endX - startX, y: endY - startY });
    }

    startAutoNextTimer();
  };

  const handleNextClick = () => {
    clearTimeout(autoNextTimeout.current!);
    current < quizData.length - 1 ? goToNextQuestion() : handleSubmit();
  };

  const handleSubmit = () => {
    const finalAnswers = current === answers.length ? [...answers, selected || ''] : answers;
    const finalScore = score + (current === answers.length && quizData[current].answer === (selected || '') ? 4 : 0);
    const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);

    localStorage.setItem('quizResult', JSON.stringify({
      score: finalScore,
      answers: finalAnswers,
      timeSpent: totalTimeSpent,
      quizTitle,
      questions: quizData,
      totalQuestions: quizData.length,
      timestamp: Date.now()
    }));

    clearTimeout(autoNextTimeout.current!);
    clearInterval(questionTimerInterval.current!);
    router.push('/result');
  };

  const triggerCoinAnimation = () => {
    setTimeout(() => setCoinPosition(null), 0);
  };

  useEffect(() => () => {
    clearTimeout(autoNextTimeout.current!);
    clearInterval(questionTimerInterval.current!);
  }, []);

  const currentQuestion = quizData[current];
  const isLastQuestion = current === quizData.length - 1;
  const timeLeft = QUESTION_DURATION - questionTime;

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18333a]">
        <motion.div
          key="spinner"
          className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18333a] text-white flex flex-col items-center p-4 sm:p-6 relative overflow-hidden">
      
      <header className="w-full max-w-4xl flex justify-between items-center py-4 relative z-10">
  <motion.h1 className="text-xl md:text-2xl font-bold text-yellow-400 truncate">
    {quizTitle}
  </motion.h1>
  
  <div className="flex items-center space-x-4">
    <motion.div 
      ref={scoreRef} 
      className="flex items-center space-x-2 bg-purple-600 rounded-full px-3 py-1 text-sm sm:text-base font-bold shadow-md"
    >
      <span>{score}</span>
      <span className="text-yellow-300 text-lg">🪙</span>
    </motion.div>

    <motion.button 
      onClick={toggleMusic} 
      className="text-yellow-300 text-2xl p-2 hover:bg-[#2b4956] rounded-full transition-all"
      aria-label="Toggle Background Music"
    >
      {isMusicPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
    </motion.button>
  </div>
</header>


      <AnimatePresence mode="wait">
        <motion.main key={current} variants={questionCardVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl bg-[#1a3a42] rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="text-lg sm:text-xl font-bold text-yellow-400">Question {current + 1} of {quizData.length}</div>
            <div className={`text-lg sm:text-xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>⏱️ {timeLeft}s</div>
          </div>

          {currentQuestion.image && (
            <div className="w-full h-48 sm:h-64 relative rounded-xl overflow-hidden mb-6">
              <Image src={currentQuestion.image} alt="Question Image" layout="fill" objectFit="cover" />
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-100">{currentQuestion.question}</h2>

          <div className="w-full space-y-3">
            {currentQuestion.options.map(option => (
              <motion.button key={option} variants={optionVariants} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors shadow-md
                ${selected === option ? option === currentQuestion.answer ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  : selected && option === currentQuestion.answer ? 'bg-green-600 text-white' : 'bg-[#2b4956] text-gray-100 hover:bg-[#3a5d6b]'}
                ${selected ? 'pointer-events-none' : ''}`} onClick={(e) => handleSelect(option, e)}>
                {option}
              </motion.button>
            ))}
          </div>

          {selected && (
            <motion.button className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition-colors" onClick={waitingNext ? handleNextClick : undefined}>
              {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
            </motion.button>
          )}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>
        {coinPosition && (
          <motion.div className="absolute z-50 text-yellow-300 text-2xl" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: coinPosition.x, y: coinPosition.y, opacity: 1, scale: 1.5 }} exit={{ opacity: 1 , scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            🪙🪙🪙
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
