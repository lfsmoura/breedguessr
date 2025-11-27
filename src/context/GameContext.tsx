import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

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

interface GameContextType {
  gameState: 'start' | 'playing' | 'finished'
  currentQuestion: number
  score: number
  questions: GameQuestion[]
  isLoading: boolean
  totalQuestions: number
  currentQuestionData: GameQuestion | null
  startGame: () => Promise<void>
  handleAnswered: (isCorrect: boolean) => void
  resetGame: () => void
  shareScore: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

const BASE_URL = import.meta.env.DEV
  ? 'https://pub-ae384ff5bace4bf4a689ef899b70644c.r2.dev'
  : 'https://images.breedguessr.com'

export const IMAGE_BASE_URL = BASE_URL

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<GameQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const startGame = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/game?count=10')
      const data = await response.json()
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received')
      }
      setCurrentQuestion(0)
      setScore(0)
      setQuestions(data.questions)
      setGameState('playing')
    } catch (error) {
      console.error('Error starting game:', error)
      alert('Failed to load game data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAnswered = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 10)
    }

    setQuestions(qs => {
      setCurrentQuestion(q => {
        if (q < qs.length - 1) {
          return q + 1
        } else {
          setGameState('finished')
          return q
        }
      })
      return qs
    })
  }, [])

  const shareScore = useCallback(() => {
    const text = `I just scored ${score}/100 points in the Dog Breed Guessing Game! Can you beat my score?`
    if (navigator.share) {
      navigator.share({
        title: 'Dog Breed Game Score',
        text: text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href)
      alert('Score copied to clipboard!')
    }
  }, [score])

  const resetGame = useCallback(() => {
    setGameState('start')
    setCurrentQuestion(0)
    setScore(0)
    setQuestions([])
  }, [])

  const value = useMemo(() => ({
    gameState,
    currentQuestion,
    score,
    questions,
    isLoading,
    totalQuestions: questions.length,
    currentQuestionData: questions[currentQuestion] || null,
    startGame,
    handleAnswered,
    resetGame,
    shareScore,
  }), [gameState, currentQuestion, score, questions, isLoading, startGame, handleAnswered, resetGame, shareScore])

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
