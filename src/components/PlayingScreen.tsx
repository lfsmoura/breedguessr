import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, IMAGE_BASE_URL } from '../context/GameContext'

function Fireworks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 1000}ms`,
            animationDuration: '1s'
          }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 border-4 border-yellow-400 rounded-full animate-ping"></div>
        </div>
      ))}
    </div>
  )
}

export function PlayingScreen() {
  const { currentQuestion, totalQuestions, score, currentQuestionData, handleAnswered } = useGame()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showFireworks, setShowFireworks] = useState(false)
  const [flashRed, setFlashRed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
  }, [currentQuestion])

  if (!currentQuestionData) return null

  const question = currentQuestionData
  const correctAnswer = question.dog.dog_breed

  const checkAnswer = (selected: string) => {
    if (selectedAnswer !== null) return // Already answered

    const correct = correctAnswer.toLowerCase().trim() === selected.toLowerCase().trim()
    setSelectedAnswer(selected)
    setIsCorrect(correct)

    if (correct) {
      setShowFireworks(true)
      setTimeout(() => setShowFireworks(false), 2000)
    } else {
      setFlashRed(true)
      setTimeout(() => setFlashRed(false), 500)
    }

    setTimeout(() => {
      setSelectedAnswer(null)
      setIsCorrect(null)
      handleAnswered(correct)
    }, 2000)
  }

  const getOptionStyle = (option: string) => {
    const isSelected = selectedAnswer?.toLowerCase().trim() === option.toLowerCase().trim()
    const isCorrectAnswer = correctAnswer.toLowerCase().trim() === option.toLowerCase().trim()
    const hasAnswered = selectedAnswer !== null

    if (!hasAnswered) {
      return "bg-gray-100 hover:bg-blue-100 border-gray-300 hover:border-blue-500 text-gray-800"
    }

    if (isSelected && isCorrect) {
      // Selected correct answer - bright green
      return "bg-green-500 border-green-600 text-white"
    }

    if (isSelected && !isCorrect) {
      // Selected wrong answer - red
      return "bg-red-500 border-red-600 text-white"
    }

    if (isCorrectAnswer && !isCorrect) {
      // Show correct answer when user was wrong - muted green
      return "bg-green-200 border-green-300 text-green-800 opacity-75"
    }

    // Other options - muted
    return "bg-gray-100 border-gray-200 text-gray-400 opacity-50"
  }

  return (
    <>
      {showFireworks && <Fireworks />}
      <motion.div
        layoutId="game-card"
        layout
        transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
        className="card-comic p-3 sm:p-8 max-w-lg w-full">
        <div className="mb-4 sm:mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-6 relative">
          {!imageLoaded && (
            <div className="w-80 h-80 rounded-2xl mx-auto shadow-lg bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          <img
            key={`dog-${question.dog.id}`}
            src={`${IMAGE_BASE_URL}/${question.dog.hash}`}
            alt="Dog to identify"
            className={`w-80 h-80 object-cover rounded-2xl mx-auto shadow-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
            onLoad={() => setImageLoaded(true)}
          />        
          <div className="mt-4 sm:mt-6 text-center">
            <span className="text-xl font-bold text-green-600 font-chewy">
              {score} / 100 points
            </span>
          </div>
        </div>



        <div className="text-center">
          <div className="flex flex-col gap-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer?.toLowerCase().trim() === option.toLowerCase().trim()
              const isCorrectAnswer = correctAnswer.toLowerCase().trim() === option.toLowerCase().trim()
              const hasAnswered = selectedAnswer !== null

              return (
                <button
                  key={index}
                  onClick={() => checkAnswer(option)}
                  disabled={hasAnswered}
                  className={`relative w-full p-4 border-2 rounded-xl text-lg font-medium transition-all duration-300 ${getOptionStyle(option)} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  {hasAnswered && isCorrectAnswer && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">✓</span>
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">✗</span>
                  )}
                </button>
              )
            })}

          <p className={`mt-4 h-7 text-lg font-bold ${selectedAnswer === null ? 'text-gray-600' : isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {selectedAnswer === null ? "Can you guess this dog's breed?" : isCorrect ? '+10 points!' : `It was ${correctAnswer}`}
          </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}
