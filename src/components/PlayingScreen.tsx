interface Dog {
  id: number
  dog_breed: string
  image: string
  hash: string
}

interface GameQuestion {
  dog: Dog
  options: string[]
}

interface PlayingScreenProps {
  currentQuestion: number
  totalQuestions: number
  score: number
  question: GameQuestion
  feedback: string
  flashRed: boolean
  showFireworks: boolean
  baseUrl: string
  onAnswer: (answer: string) => void
}

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

export function PlayingScreen({
  currentQuestion,
  totalQuestions,
  score,
  question,
  feedback,
  flashRed,
  showFireworks,
  baseUrl,
  onAnswer,
}: PlayingScreenProps) {
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
            src={`${baseUrl}/${question.dog.hash}`}
            alt="Dog to identify"
            className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-lg"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What breed is this dog?
          </h2>

          {feedback === '' && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswer(option)}
                  className="w-full p-4 bg-gray-100 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-500 rounded-xl text-lg font-medium text-gray-800 transition-all duration-200"
                >
                  {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          )}

          {feedback === 'correct' && (
            <div className="text-center">
              <div className="text-4xl text-green-500 mb-2">✅</div>
              <p className="text-xl text-green-600 font-bold">Correct! +10 points</p>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center">
              <div className="text-4xl text-red-500 mb-2">❌</div>
              <p className="text-xl text-red-600 font-bold">
                Wrong! It was a {question.dog.dog_breed}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
