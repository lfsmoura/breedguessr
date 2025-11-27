import { useGame } from '../context/GameContext'

export function FinishedScreen() {
  const { score, totalQuestions, resetGame, shareScore } = useGame()
  const maxScore = totalQuestions * 10

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h1>
        <div className="text-5xl font-bold text-green-600 mb-4">
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
            className="w-full bg-linear-to-r from-pink-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
          >
            Share Score
          </button>
          <button
            onClick={resetGame}
            className="w-full bg-linear-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}
