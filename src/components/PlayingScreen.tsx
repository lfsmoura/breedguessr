import { useState } from 'react'
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
    <div className={`min-h-screen bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 transition-all duration-300 ${flashRed ? 'bg-red-500' : ''}`}>
      {showFireworks && <Fireworks />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="text-xl font-bold text-green-600">
            Score: {score}
          </div>
        </div>

        <div className="text-center mb-6">
          <img
            key={`dog-${question.dog.id}`}
            src={`${IMAGE_BASE_URL}/${question.dog.hash}`}
            alt="Dog to identify"
            className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-lg"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What breed is this dog?
          </h2>

          <div className="space-y-3">
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
          </div>

          <p className={`mt-4 h-7 text-lg font-bold ${selectedAnswer === null ? 'invisible' : ''} ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '+10 points!' : `It was ${correctAnswer}`}
          </p>
        </div>
      </div>
    </div>
  )
}
