import { motion } from 'motion/react'
import { useGame } from '../context/GameContext'

export function FinishedScreen() {
  const { score, totalQuestions, resetGame, shareScore } = useGame()
  const maxScore = totalQuestions * 10

  return (
    <motion.div
    layout
      layoutId="game-card"
      className="card-comic p-8 text-center max-w-md w-full">
        <img
          src="/bye.gif"
          alt="Waving goodbye"
          className="w-48 h-48 object-cover rounded-2xl mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-chewy">Game Complete!</h1>
        <div className="text-5xl font-bold text-green-600 mb-4 font-chewy">
          {score}/{maxScore}
        </div>
        <p className="text-gray-600 mb-6">
          {score === maxScore ? "Perfect score! You're a dog breed expert!" :
            score >= 70 ? "Great job! You know your dog breeds!" :
              score >= 40 ? "Not bad! Keep practicing!" :
                "Keep learning about dog breeds!"}
        </p>

        <div className="space-y-3">
          <button
            onClick={shareScore}
            className="w-full btn-comic font-bold py-3 px-8 text-lg font-chewy"
          >
            Share Score
          </button>
          <button
            onClick={resetGame}
            className="w-full btn-comic font-bold py-3 px-8 text-lg font-chewy"
          >
            Play Again
          </button>
        </div>
    </motion.div>
  )
}
