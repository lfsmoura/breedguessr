import { useGame } from '../context/GameContext'

export function StartScreen() {
  const { isLoading, startGame } = useGame()

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🐕</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dog Breed Game</h1>
        <p className="text-gray-600 mb-6">
          Guess the breed of 10 different dogs and earn points!
          Get 10 points for each correct answer.
        </p>
        <button
          onClick={startGame}
          disabled={isLoading}
          className="bg-linear-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Start Game'}
        </button>
      </div>
    </div>
  )
}
