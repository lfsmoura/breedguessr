import { motion } from 'motion/react'
import { useGame } from '../context/GameContext'

export function StartScreen() {
  const { isLoading, startGame } = useGame()

  return (
    <motion.div
      layoutId="game-card"
      layout
      className="card-comic p-8 text-center max-w-md w-full">
        <img
          src="/hi.gif"
          alt="Welcome"
          className="w-48 h-48 object-cover rounded-2xl mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-chewy">breedguessr.com</h1>
        <p className="text-gray-600 mb-6">
          Guess the breed of 10 different dogs and earn points!
          Get 10 points for each correct answer.
        </p>
        <button
          onClick={startGame}
          disabled={isLoading}
          className="btn-comic font-bold py-3 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed font-chewy"
        >
          {isLoading ? 'Loading...' : 'Start Game'}
        </button>
    </motion.div>
  )
}
